import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { addRawUser, resetDb } from 'test/automation/database'
import { DataSource } from 'typeorm'
import { UpdateUserDTO } from '../../http'
import { UserRepository } from '../../infra'
import { UpdateUserInfoUseCase } from './update-user-info.usecase'

describe('UpdateUserInfo', () => {
  let useCase: UpdateUserInfoUseCase
  let userRepository: UserRepository
  let dataSource: DataSource

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    module.init()

    useCase = module.get(UpdateUserInfoUseCase)
    userRepository = module.get(UserRepository)
    dataSource = module.get(DataSource)
  })

  afterEach(async () => {
    await resetDb(dataSource)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it('Should update user info and return new tokens', async () => {
    const user = await addRawUser(dataSource)

    const updateData: UpdateUserDTO = {
      name: 'new',
      password: '123123123123'
    }

    const tokens = await useCase.execute({ userId: user.id, update: updateData })
    const updatedUser = await userRepository.findUserBy({ id: user.id })

    expect(tokens).toHaveProperty('token')
    expect(tokens).toHaveProperty('refresh')
    expect(updatedUser!.name).toBe(updateData.name)
  })
})
