import { HttpStatus } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { AppError } from 'src/common'
import { addRawUser, resetDb } from 'test/automation/database'
import { DataSource } from 'typeorm'
import { User } from '../../entities'
import { Role } from '../../enums'
import { UserRepository } from '../../infra'
import { UpdateUserRoleUseCase } from './update-user-role.usecase'

describe('UpdateUserInfo', () => {
  let useCase: UpdateUserRoleUseCase
  let userRepository: UserRepository
  let dataSource: DataSource
  let user: User
  let admin: User

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    module.init()

    useCase = module.get(UpdateUserRoleUseCase)
    userRepository = module.get(UserRepository)
    dataSource = module.get(DataSource)

    admin = await addRawUser(dataSource, { role: Role.ADMIN })
    user = await addRawUser(dataSource, { role: Role.USER, id: 2 })
  })

  afterEach(async () => {
    await resetDb(dataSource)

    admin = await addRawUser(dataSource, { role: Role.ADMIN })
    user = await addRawUser(dataSource, { role: Role.USER, id: 2 })
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it('Should update user role and add a log entry', async () => {
    const updatedUser = await useCase.execute({
      requestorId: admin.id,
      target: { userId: user.id, role: Role.ADMIN }
    })

    expect(updatedUser.role).toBe(Role.ADMIN)
  })

  it('should throw if users not found', async () => {
    const error = new AppError('Usuário não encontrado', HttpStatus.UNAUTHORIZED)

    await expect(
      useCase.execute({
        requestorId: 9999,
        target: { userId: 8888, role: Role.USER }
      })
    ).rejects.toThrow(error)
  })

  it('Should throw if requestor does not have enough permissions', async () => {
    const error = new AppError('Usuário não tem permissões suficientes', HttpStatus.UNAUTHORIZED)

    await expect(
      useCase.execute({
        requestorId: user.id,
        target: { userId: admin.id, role: Role.ADMIN }
      })
    ).rejects.toThrow(error)
  })
})
