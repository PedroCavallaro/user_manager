import { HttpStatus } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppError } from 'src/common'
import { UserRepository } from 'src/modules'
import { HashStrategy, TokenStrategy } from 'src/modules/auth/strategies'
import { makeMockUser } from 'test/mocks/user'
import { LoginUseCase } from './login.usecase'

describe('Login Use Case', () => {
  let useCase: LoginUseCase
  let userRepository: UserRepository
  let token: TokenStrategy
  let hash: HashStrategy

  const input = {
    ip: '127.0.01',
    login: {
      email: 'email@gmail.com',
      password: 'password'
    }
  }

  const mockUser = makeMockUser()

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginUseCase,
        {
          provide: UserRepository,
          useValue: {
            findUserBy: jest.fn(),
            createUser: jest.fn(),
            update: jest.fn()
          }
        },
        {
          provide: HashStrategy,
          useValue: {
            verify: jest.fn()
          }
        },
        {
          provide: TokenStrategy,
          useValue: {
            getTokens: jest.fn()
          }
        }
      ]
    }).compile()

    useCase = module.get(LoginUseCase)
    userRepository = module.get(UserRepository)
    hash = module.get(HashStrategy)
    token = module.get(TokenStrategy)
  })

  it('Should authenticate and user', async () => {
    const tokens = {
      token: 'token',
      refresh: 'refresh'
    }

    jest.spyOn(userRepository, 'findUserBy').mockResolvedValue(mockUser)
    jest.spyOn(hash, 'verify').mockResolvedValue(true)
    jest.spyOn(token, 'getTokens').mockResolvedValue(tokens)

    const result = await useCase.execute(input)

    expect(hash.verify).toHaveBeenCalledWith(input.login.password, mockUser.password)
    expect(token.getTokens).toHaveBeenCalledWith(mockUser)
    expect(result).toEqual(tokens)
  })

  it('Should throw an error if user not exists ', async () => {
    jest.spyOn(userRepository, 'findUserBy').mockResolvedValue(null)

    const error = new AppError('Usuário não encontrado', HttpStatus.FORBIDDEN)

    await expect(useCase.execute(input)).rejects.toThrow(error)
  })

  it('Should throw an error if password dont match', async () => {
    jest.spyOn(userRepository, 'findUserBy').mockResolvedValue(mockUser)
    jest.spyOn(hash, 'verify').mockResolvedValue(false)

    const error = new AppError('Senha incorreta', HttpStatus.UNAUTHORIZED)

    await expect(useCase.execute(input)).rejects.toThrow(error)
  })
})
