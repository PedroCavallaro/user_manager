import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { Request } from 'express'

export const JwtPayload = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<Request>()

  return request.user
})
