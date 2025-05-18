import { getQueueToken } from '@nestjs/bullmq'
import { Test, TestingModule } from '@nestjs/testing'
import { Queue } from 'bullmq'
import { AppError } from 'src/common'
import { makeMockUser } from 'test/mocks/user'
import { LogAction, Role } from '../../enums'
import { UserRepository } from '../../infra'
import { ADD_USER_LOG_JOB, AddUserLogDTO, USER_LOG_QUEUE } from '../../infra/queue'
import { DeleteUserUseCase } from './delete-user.usecase'

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase
  let userRepository: UserRepository
  let userLogQueue: Queue<AddUserLogDTO>

  const admin = makeMockUser({ id: 1, role: Role.ADMIN })
  const user = makeMockUser({ id: 2, role: Role.USER })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserUseCase,
        {
          provide: UserRepository,
          useValue: {
            findUserBy: jest.fn(),
            delete: jest.fn()
          }
        },
        {
          provide: getQueueToken(USER_LOG_QUEUE),
          useValue: {
            add: jest.fn()
          }
        }
      ]
    }).compile()

    useCase = module.get(DeleteUserUseCase)
    userRepository = module.get(UserRepository)
    userLogQueue = module.get(getQueueToken(USER_LOG_QUEUE))
  })

  it('Should delete the user and log the action', async () => {
    jest
      .spyOn(userRepository, 'findUserBy')
      .mockResolvedValueOnce(admin)
      .mockResolvedValueOnce(user)

    await useCase.execute({ requestorId: admin.id, userId: user.id })

    expect(userRepository.delete).toHaveBeenCalledWith(2)

    expect(userLogQueue.add).toHaveBeenCalledWith(ADD_USER_LOG_JOB, {
      userId: user.id,
      action: LogAction.DELETE,
      requestorId: admin.id
    })
  })

  it('Should throw if requestor or target user is not found', async () => {
    jest.spyOn(userRepository, 'findUserBy').mockResolvedValue(null)

    await expect(useCase.execute({ requestorId: 1, userId: 2 })).rejects.toThrow(AppError)

    expect(userRepository.delete).not.toHaveBeenCalled()
    expect(userLogQueue.add).not.toHaveBeenCalled()
  })

  it('Should throw if requestor has lower role than target', async () => {
    const lowRoleRequestor = makeMockUser({ id: 3, role: Role.USER })

    jest
      .spyOn(userRepository, 'findUserBy')
      .mockResolvedValueOnce(lowRoleRequestor)
      .mockResolvedValueOnce(admin)

    await expect(
      useCase.execute({ requestorId: lowRoleRequestor.id, userId: admin.id })
    ).rejects.toThrow(AppError)

    expect(userRepository.delete).not.toHaveBeenCalled()
    expect(userLogQueue.add).not.toHaveBeenCalled()
  })
})
