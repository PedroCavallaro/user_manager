import { getQueueToken } from '@nestjs/bullmq'
import { HttpStatus } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AppError } from 'src/common'
import { makeMockUser } from 'test/mocks/user'
import { Role } from '../../enums'
import { ADD_USER_LOG_JOB, AddUserLogDTO, USER_LOG_QUEUE } from '../../infra/queue'
import { UserRepository } from '../../infra/repositories'
import { UpdateUserRoleUseCase } from './update-user-role.usecase'

describe('UpdateUserRoleUseCase', () => {
  let useCase: UpdateUserRoleUseCase
  let userRepository: jest.Mocked<UserRepository>
  let userLogQueue: { add: jest.Mock }

  const admin = makeMockUser({ id: 1, role: Role.ADMIN })
  const user = makeMockUser({ id: 2, role: Role.USER })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserRoleUseCase,
        {
          provide: UserRepository,
          useValue: {
            findUserBy: jest.fn(),
            update: jest.fn()
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

    useCase = module.get(UpdateUserRoleUseCase)
    userRepository = module.get(UserRepository)
    userLogQueue = module.get(getQueueToken(USER_LOG_QUEUE))
  })

  it('Should throw if requestor or target user is not found', async () => {
    userRepository.findUserBy.mockResolvedValueOnce(null)
    userRepository.findUserBy.mockResolvedValueOnce(null)

    const error = new AppError('Usuário não encontrado', HttpStatus.UNAUTHORIZED)

    await expect(
      useCase.execute({
        requestorId: 1,
        target: { userId: 2, role: Role.ADMIN }
      })
    ).rejects.toThrow(error)
  })

  it('Should throw if requestor does not have enough permissions', async () => {
    jest
      .spyOn(userRepository, 'findUserBy')
      .mockResolvedValueOnce(user)
      .mockResolvedValueOnce(admin)

    const error = new AppError('Usuário não tem permissões suficientes', HttpStatus.UNAUTHORIZED)

    await expect(
      useCase.execute({
        requestorId: user.id,
        target: { userId: admin.id, role: Role.USER }
      })
    ).rejects.toThrow(error)
  })

  it('Should update user role and log the action', async () => {
    jest
      .spyOn(userRepository, 'findUserBy')
      .mockResolvedValueOnce(admin)
      .mockResolvedValueOnce(user)

    userRepository.update.mockResolvedValueOnce({ id: 2, role: Role.ADMIN } as any)

    const result = await useCase.execute({
      requestorId: admin.id,
      target: { userId: user.id, role: Role.ADMIN }
    })

    expect(userRepository.update).toHaveBeenCalledWith(2, { role: Role.ADMIN })

    expect(userLogQueue.add).toHaveBeenCalledWith(ADD_USER_LOG_JOB, {
      requestorId: 1,
      userId: 2,
      action: 'UPDATE'
    } as AddUserLogDTO)

    expect(result).toEqual({ id: 2, role: Role.ADMIN })
  })
})
