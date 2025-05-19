import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { resetDb } from 'test/automation/database'
import { DataSource } from 'typeorm'
import { Role } from '../../enums'
import { CreateNewUserDTO } from '../../http'
import { UserRepository } from '../../infra'
import { CreateNewUserUseCase } from './create-new-user.usecase'

describe('CreateNewUserUseCase', () => {
  let useCase: CreateNewUserUseCase
  let userRepository: UserRepository
  let dataSource: DataSource

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    module.init()

    useCase = module.get(CreateNewUserUseCase)
    userRepository = module.get(UserRepository)
    dataSource = module.get(DataSource)
  })

  afterEach(async () => {
    await resetDb(dataSource)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it('Should create an user', async () => {
    const user: CreateNewUserDTO = {
      email: 'newUser',
      name: 'new',
      role: Role.USER,
      password: '123'
    }

    const res = await useCase.execute(user)

    expect(res.id).toBeDefined()
  })
})
