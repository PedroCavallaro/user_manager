import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { addRawUser, resetDb } from 'test/automation/database'
import { DataSource } from 'typeorm'
import { UserRepository } from '../../infra'
import { GetInactiveUsersUseCase } from './get-inactive-users.usecase'

describe('GetInactiveUsersUseCase', () => {
  let useCase: GetInactiveUsersUseCase
  let userRepository: UserRepository
  let dataSource: DataSource

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    module.init()

    useCase = module.get(GetInactiveUsersUseCase)
    userRepository = module.get(UserRepository)
    dataSource = module.get(DataSource)
  })

  afterEach(async () => {
    await resetDb(dataSource)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it('Should return inactve users paginated', async () => {
    await addRawUser(dataSource, {
      loggedAt: new Date()
    })

    const inactiveUsers = await Promise.all(
      Array.from({ length: 5 }).map((_, i) =>
        addRawUser(dataSource, {
          id: i,
          email: `inativo${i}@example.com`,
          loggedAt: new Date('2020-01-01')
        })
      )
    )

    await Promise.all(inactiveUsers)

    const result = await useCase.execute({
      page: 1,
      getSkipAndTake: () => ({ skip: 0, take: 5 })
    })

    expect(result.data.length).toBe(5)
    expect(result.total).toBe(5)
    expect(result.page).toBe(1)

    for (const user of result.data) {
      expect(user.inactiveSince).toEqual(new Date('2020-01-01'))
    }
  })
})
