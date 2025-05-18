import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'
import { AppError } from 'src/common'

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: (error?: any) => void) {
    req.headers['x-access-control-auth-middleware'] = 'true'

    const apiKey = req.headers['x-api-key']
    const error = new AppError('Unauthorized request', HttpStatus.UNAUTHORIZED)

    if (!apiKey) {
      return res.status(HttpStatus.UNAUTHORIZED).json(error)
    }

    if (apiKey !== process.env.API_KEY) {
      return res.status(HttpStatus.UNAUTHORIZED).json(error)
    }

    next()
  }
}
