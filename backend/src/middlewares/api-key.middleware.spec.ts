import { HttpStatus } from '@nestjs/common'
import { Request, Response } from 'express'
import { AppError } from 'src/common'
import { ApiKeyMiddleware } from './api-key.middlewate'

describe('ApiKeyMiddleware', () => {
  let middleware: ApiKeyMiddleware
  let req: Partial<Request>
  let res: Partial<Response>
  let next: jest.Mock

  const error = new AppError('Unauthorized request', HttpStatus.UNAUTHORIZED)

  beforeEach(() => {
    middleware = new ApiKeyMiddleware()
    process.env.API_KEY = 'api-key'

    req = {
      headers: {}
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    next = jest.fn()
  })

  it('Should return 401 if api-key not exists', () => {
    middleware.use(req as Request, res as Response, next)

    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED)
    expect(res.json).toHaveBeenCalledWith(error)
    expect(next).not.toHaveBeenCalled()
  })

  it('Should return 401 if api-key is wrong', () => {
    req.headers!['x-api-key'] = 'invalid'

    middleware.use(req as Request, res as Response, next)

    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED)
    expect(res.json).toHaveBeenCalledWith(error)
    expect(next).not.toHaveBeenCalled()
  })

  it('Should let request continue if api-key is correct', () => {
    req.headers!['x-api-key'] = 'api-key'

    middleware.use(req as Request, res as Response, next)

    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
    expect(req.headers!['x-access-control-auth-middleware']).toBe('true')
  })
})
