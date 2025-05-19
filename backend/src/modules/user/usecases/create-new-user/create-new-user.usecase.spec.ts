import { Test, TestingModule } from '@nestjs/testing'
import { HashStrategy } from 'src/modules/auth/strategies'
import { User } from '../../entities'
import { Role } from '../../enums'
import { CreateNewUserDTO } from '../../http'
import { UserRepository } from '../../infra'
import { CreateNewUserUseCase } from './create-new-user.usecase'

describe('CreateNewUserUseCase', () => {
  let useCase: CreateNewUserUseCase
  let userRepository: UserRepository
  let hashStrategy: HashStrategy

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateNewUserUseCase,
        {
          provide: UserRepository,
          useValue: {
            createUser: jest.fn()
          }
        },
        {
          provide: HashStrategy,
          useValue: {
            hash: jest.fn()
          }
        }
      ]
    }).compile()

    useCase = module.get(CreateNewUserUseCase)
    userRepository = module.get(UserRepository)
    hashStrategy = module.get(HashStrategy)
  })

  it('Should create an user', async () => {
    const user: CreateNewUserDTO = {
      email: 'email',
      name: 'name',
      role: Role.USER,
      password: '123'
    }

    jest.spyOn(userRepository, 'createUser').mockResolvedValue(user as User)
    jest.spyOn(hashStrategy, 'hash').mockResolvedValue('123')

    const res = await useCase.execute(user)

    expect(res).toBe(user)
    expect(userRepository.createUser).toHaveBeenCalledWith(user)
  })
})
