import { Test, TestingModule } from '@nestjs/testing'
import { ThrottlerModule } from '@nestjs/throttler'
import { Response } from 'express'
import { AuthController, CreateUserDTO, LoginDTO, RefreshTokensDTO } from 'src/modules'
import { TokenStrategy } from 'src/modules/auth/strategies'
import { CreateUserUseCase, LoginUseCase } from 'src/modules/auth/use-cases'
import { mockUseCase } from 'test/mocks/use-case'

describe('AuthController', () => {
  let controller: AuthController
  let createUserUseCase: CreateUserUseCase
  let loginUseCase: LoginUseCase
  let tokenStrategy: TokenStrategy

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({
          throttlers: [
            {
              ttl: process.env.THROTTLE_TTL,
              limit: process.env.THROTTLE_LIMIT
            }
          ]
        })
      ],
      controllers: [AuthController],
      providers: [
        mockUseCase(LoginUseCase),
        mockUseCase(CreateUserUseCase),
        {
          provide: TokenStrategy,
          useValue: {
            refresh: jest.fn()
          }
        }
      ]
    }).compile()

    controller = module.get<AuthController>(AuthController)
    createUserUseCase = module.get(CreateUserUseCase)
    loginUseCase = module.get(LoginUseCase)
    tokenStrategy = module.get(TokenStrategy)
  })

  it('should register a user', async () => {
    const dto: CreateUserDTO = {
      name: 'Test User',
      email: 'test@email.com',
      password: '123456'
    }

    const result = { token: 'token', refresh: 'refresh' }

    jest.spyOn(createUserUseCase, 'execute').mockResolvedValue(result)

    const response = await controller.register(dto)

    expect(createUserUseCase.execute).toHaveBeenCalledWith(dto)
    expect(response).toEqual(result)
  })

  it('Should login a user and return response', async () => {
    const dto: LoginDTO = {
      email: 'test@email.com',
      password: '123456'
    }

    const result = { token: 'token', refresh: 'refresh' }

    const req = { ip: '127.0.0.1' } as any
    const sendMock = jest.fn()
    const statusMock = jest.fn(() => ({ send: sendMock }))
    const res = { status: statusMock } as unknown as Response

    jest.spyOn(loginUseCase, 'execute').mockResolvedValue(result)

    await controller.login(req, res, dto)

    expect(loginUseCase.execute).toHaveBeenCalledWith({
      login: dto,
      ip: req.ip
    })
    expect(statusMock).toHaveBeenCalledWith(200)
    expect(sendMock).toHaveBeenCalledWith(result)
  })

  it('Should handle login exception and return error response', async () => {
    const dto: LoginDTO = {
      email: 'test@email.com',
      password: 'wrong-password'
    }

    const error = { status: 401, message: 'Unauthorized' }

    const req = { ip: '127.0.0.1' } as any
    const sendMock = jest.fn()
    const statusMock = jest.fn(() => ({ send: sendMock }))
    const res = { status: statusMock } as unknown as Response

    jest.spyOn(loginUseCase, 'execute').mockRejectedValue(error)

    await controller.login(req, res, dto)

    expect(statusMock).toHaveBeenCalledWith(401)
    expect(sendMock).toHaveBeenCalledWith({ ...error, name: undefined })
  })

  it('Should refresh token', async () => {
    const dto: RefreshTokensDTO = { refresh: 'refresh-token' }
    const result = { token: 'new-token', refresh: 'new-refresh' }

    jest.spyOn(tokenStrategy, 'refresh').mockResolvedValue(result)

    const response = await controller.refresh(dto)

    expect(tokenStrategy.refresh).toHaveBeenCalledWith(dto.refresh)
    expect(response).toEqual(result)
  })
})
