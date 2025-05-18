import * as crypto from 'crypto'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Cache } from 'cache-manager'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AppError } from 'src/common'
import { UserJwtPayload } from 'src/global'
import { User } from 'src/modules/user/entities'

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    private readonly jwtService: JwtService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    })
  }

  async validate(payload: any): Promise<any> {
    if (payload.type !== 'access') {
      throw new AppError('Invalid token type', HttpStatus.UNAUTHORIZED)
    }

    return payload
  }

  private _getRefreshKey(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex')
  }

  private createJwtPayload(
    user: Pick<User, 'id' | 'email' | 'role' | 'name'>,
    config: {
      secret: string
      expiresIn: string
      type: 'access' | 'refresh'
    }
  ): string {
    const payload: UserJwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      type: config.type
    }

    return this.jwtService.sign(payload, {
      secret: config.secret,
      expiresIn: config.expiresIn
    })
  }

  async getTokens(user: User) {
    const accessToken = this.createJwtPayload(user, {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
      type: 'access'
    })

    const refreshToken = this.createJwtPayload(user, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: process.env.REFRESH_EXPIRES_IN,
      type: 'refresh'
    })

    const refreshKey = this._getRefreshKey(refreshToken)
    await this.cache.set(refreshKey, refreshToken)

    return {
      token: accessToken,
      refresh: refreshToken
    }
  }

  async refresh(refreshToken: string) {
    try {
      const key = this._getRefreshKey(refreshToken)

      const cachedToken = await this.cache.get<string>(key)
      if (!cachedToken) {
        throw new UnauthorizedException()
      }

      const payload: User = this.jwtService.verify(cachedToken, {
        secret: process.env.REFRESH_SECRET
      })

      const [tokens] = await Promise.all([this.getTokens(payload), this.cache.del(key)])

      return tokens
    } catch (error) {
      throw new UnauthorizedException()
    }
  }
}
