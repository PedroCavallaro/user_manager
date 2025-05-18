import { HttpException } from '@nestjs/common'

export class AppError extends HttpException {
  constructor(
    message: string,
    statusCode = 400,
    public readonly details: Record<string, any> | undefined = undefined
  ) {
    super(message, statusCode)
  }
}
