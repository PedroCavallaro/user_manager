import { HttpStatus } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { AppError } from 'src/common'
import { CreateUserDTO } from 'src/modules/auth/http'
import { UserRepository } from 'src/modules/user'
import { addRawUser, resetDb } from 'test/automation/database'
import { DataSource } from 'typeorm'
import { CreateUserUseCase } from './create-user.usecase'

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase
  let userRepository: UserRepository
  let dataSource: DataSource

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    module.init()

    useCase = module.get(CreateUserUseCase)
    userRepository = module.get(UserRepository)
    dataSource = module.get(DataSource)
  })

  afterEach(async () => {
    await resetDb(dataSource)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it('Should create an user and return tokens', async () => {
    const dto: CreateUserDTO = {
      email: 'test@email.com',
      name: 'Test',
      password: '123456'
    }

    const result = await useCase.execute(dto)

    expect(result).toHaveProperty('token')
    expect(result).toHaveProperty('refresh')

    const savedUser = await userRepository.findUserBy({ email: dto.email })

    expect(savedUser).toBeDefined()
    expect(savedUser?.password).not.toBe(dto.password)
  })

  it('Should throw an error if user already exists', async () => {
    const dto: CreateUserDTO = {
      email: 'email@email.com',
      name: 'name',
      password: '123456'
    }

    await addRawUser(dataSource, { ...dto })

    const error = new AppError('Usuário já existe', HttpStatus.FORBIDDEN)
    await expect(useCase.execute(dto)).rejects.toThrow(error)
  })
})
