import { HttpStatus } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppError } from 'src/common'
import { CreateUserDTO } from 'src/modules'
import { HashStrategy, TokenStrategy } from 'src/modules/auth/strategies'
import { CreateUserUseCase } from 'src/modules/auth/use-cases'
import { UserRepository } from 'src/modules/user'
import { User } from 'src/modules/user/entities'
import { makeMockUser } from 'test/mocks/user'

describe('Create User Use Case', () => {
  let useCase: CreateUserUseCase
  let userRepository: UserRepository
  let hash: HashStrategy
  let token: TokenStrategy

  const input: CreateUserDTO = {
    name: 'jhon doe',
    email: 'email@gmail.com',
    password: 'password'
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: UserRepository,
          useValue: {
            findUserBy: jest.fn(),
            createUser: jest.fn()
          }
        },
        {
          provide: HashStrategy,
          useValue: {
            hash: jest.fn()
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

    useCase = module.get(CreateUserUseCase)
    userRepository = module.get(UserRepository)
    hash = module.get(HashStrategy)
    token = module.get(TokenStrategy)
  })

  it('Should create and user', async () => {
    const mockUser = makeMockUser()
    const tokens = {
      token: 'token',
      refresh: 'refresh'
    }

    jest.spyOn(hash, 'hash').mockResolvedValue('password')
    jest.spyOn(userRepository, 'createUser').mockResolvedValue(mockUser)
    jest.spyOn(token, 'getTokens').mockResolvedValue(tokens)

    const result = await useCase.execute(input)

    expect(hash.hash).toHaveBeenCalledWith(input.password)
    expect(userRepository.createUser).toHaveBeenCalledWith(input)
    expect(token.getTokens).toHaveBeenCalledWith(mockUser)
    expect(result).toEqual(tokens)
  })
  it('Should throw an error if user exists ', async () => {
    jest.spyOn(userRepository, 'findUserBy').mockResolvedValue(input as User)

    const error = new AppError('User already exists', HttpStatus.FORBIDDEN)

    await expect(useCase.execute(input)).rejects.toThrow(error)
  })
})
