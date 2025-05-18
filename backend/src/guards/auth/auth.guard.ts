import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { UNPROTECTED_KEY } from 'src/common'

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private readonly reflector: Reflector
  ) {
    super()
  }

  private checkContext(context: ExecutionContext) {
    const hasPublicDecorator = this.reflector.getAllAndOverride<boolean>(UNPROTECTED_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    const isPublicContext = hasPublicDecorator
    const doSetUser = !hasPublicDecorator

    return {
      isPublicContext,
      doSetUser
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    const { isPublicContext } = this.checkContext(context)

    if (isPublicContext) {
      return true
    }

    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      const payload = this.jwtService.verify(token)

      if (payload.type === 'refresh') throw new UnauthorizedException()

      request['user'] = payload
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
