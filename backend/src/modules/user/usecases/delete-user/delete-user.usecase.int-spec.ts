import { HttpStatus } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { AppError } from 'src/common'
import { addRawUser, resetDb } from 'test/automation/database'
import { DataSource } from 'typeorm'
import { User } from '../../entities'
import { Role } from '../../enums'
import { UserRepository } from '../../infra'
import { DeleteUserUseCase } from './delete-user.usecase'

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase
  let userRepository: UserRepository
  let dataSource: DataSource
  let admin: User
  let user: User

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    module.init()

    useCase = module.get(DeleteUserUseCase)
    userRepository = module.get(UserRepository)
    dataSource = module.get(DataSource)

    admin = await addRawUser(dataSource, { role: Role.ADMIN })
    user = await addRawUser(dataSource, { id: 2 })
  })

  afterEach(async () => {
    await resetDb(dataSource)

    admin = await addRawUser(dataSource, { role: Role.ADMIN })
    user = await addRawUser(dataSource, { id: 2 })
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it('Should delete an user', async () => {
    await useCase.execute({
      requestorId: admin.id,
      userId: user.id
    })

    const deletedUser = await userRepository.findUserBy({ id: user.id })

    expect(deletedUser).toBeNull()
  })

  it('Should throw an error if USER tries to delete an ADMIN', async () => {
    const error = new AppError('Usuário não tem permissões suficientes', HttpStatus.UNAUTHORIZED)

    await expect(
      useCase.execute({
        requestorId: user.id,
        userId: admin.id
      })
    ).rejects.toThrow(error)
  })

  it('Should throw an error if user not exists', async () => {
    const error = new AppError('Usuário não encontrado', HttpStatus.UNAUTHORIZED)

    await expect(
      useCase.execute({
        requestorId: admin.id,
        userId: 123
      })
    ).rejects.toThrow(error)
  })
})
