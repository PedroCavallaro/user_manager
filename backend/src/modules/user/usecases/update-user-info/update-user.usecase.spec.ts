import { Test, TestingModule } from '@nestjs/testing'
import { User } from '../../entities'
import { UpdateUserDTO } from '../../http'
import { UserRepository } from '../../infra/repositories'
import { UpdateUserInfoUseCase } from './update-user-info.usecase'

describe('UpdateUserInfoUseCase', () => {
  let useCase: UpdateUserInfoUseCase
  let userRepository: jest.Mocked<UserRepository>

  const mockUser: User = {
    id: 1,
    email: 'newemail@example.com',
    name: 'new name',
    password: 'hashedpassword'
  } as User

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserInfoUseCase,
        {
          provide: UserRepository,
          useValue: {
            update: jest.fn()
          }
        }
      ]
    }).compile()

    useCase = module.get(UpdateUserInfoUseCase)
    userRepository = module.get(UserRepository)
  })

  it('should update and return the user', async () => {
    const input = {
      userId: 1,
      update: {
        name: mockUser.name,
        password: mockUser.password
      } satisfies UpdateUserDTO
    }

    jest.spyOn(userRepository, 'update').mockResolvedValue(mockUser)

    const result = await useCase.execute(input)

    expect(userRepository.update).toHaveBeenCalledWith(input.userId, {
      name: input.update.name,
      password: input.update.password
    })

    expect(result).toEqual(mockUser)
  })
})
