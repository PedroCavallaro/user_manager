import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { JwtGuard } from './auth.guard'

describe('JwtGuard', () => {
  let guard: JwtGuard
  let jwtService: jest.Mocked<JwtService>
  let reflector: jest.Mocked<Reflector>
  let context: Partial<ExecutionContext>
  let request: Partial<Request>

  beforeEach(() => {
    jwtService = {
      verify: jest.fn()
    } as any

    reflector = {
      getAllAndOverride: jest.fn()
    } as any

    guard = new JwtGuard(jwtService, reflector)

    request = {
      headers: {}
    }

    context = {
      switchToHttp: () =>
        ({
          getRequest: () => request
        }) as any,
      getHandler: jest.fn(),
      getClass: jest.fn()
    }
  })

  it('Should allow access if route is public', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true)

    const result = await guard.canActivate(context as ExecutionContext)

    expect(result).toBe(true)
  })

  it('Should throw an error if token is missing', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false)

    await expect(guard.canActivate(context as ExecutionContext)).rejects.toThrow(
      UnauthorizedException
    )
  })

  it('Should throw an error if token is invalid', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false)
    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      throw new Error('Invalid Token')
    })

    request.headers!.authorization = 'Bearer token_invalido'

    await expect(guard.canActivate(context as ExecutionContext)).rejects.toThrow(
      UnauthorizedException
    )
  })

  it('Should throw an error if token type is refresh', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false)
    jest.spyOn(jwtService, 'verify').mockReturnValue({ type: 'refresh' })

    request.headers!.authorization = 'Bearer token_refresh'

    await expect(guard.canActivate(context as ExecutionContext)).rejects.toThrow(
      UnauthorizedException
    )
  })

  it('Shoul add user on request if token is valid', async () => {
    const payload = { sub: 1, name: 'name', type: 'access' }

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false)
    jest.spyOn(jwtService, 'verify').mockReturnValue(payload)

    request.headers!.authorization = 'Bearer token_valido'

    const result = await guard.canActivate(context as ExecutionContext)

    expect(request.user).toEqual(payload)
    expect(result).toBe(true)
  })
})
