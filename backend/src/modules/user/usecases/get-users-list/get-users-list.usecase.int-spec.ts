import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { addRawUser, resetDb } from 'test/automation/database'
import { DataSource } from 'typeorm'
import { UserRepository } from '../../infra'
import { GetUsersListUseCase } from './get-users-list.usecase'

describe('GetUsersListUseCase', () => {
  let useCase: GetUsersListUseCase
  let userRepository: UserRepository
  let dataSource: DataSource

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    module.init()

    useCase = module.get(GetUsersListUseCase)
    userRepository = module.get(UserRepository)
    dataSource = module.get(DataSource)
  })

  afterEach(async () => {
    await resetDb(dataSource)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it('Should return a list of users with correct pagination', async () => {
    await Promise.all(
      Array.from({ length: 15 }).map((_, i) =>
        addRawUser(dataSource, {
          id: i,
          name: `User ${i}`,
          email: `user${i}@example.com`
        })
      )
    )

    const result = await useCase.execute({
      page: 2,
      limit: 10,
      getSkipAndTake: () => ({ skip: 10, take: 5 })
    })

    expect(result.data).toHaveLength(5)
    expect(result.page).toBe(2)
    expect(result.totalPages).toBe(2)
  })
})
