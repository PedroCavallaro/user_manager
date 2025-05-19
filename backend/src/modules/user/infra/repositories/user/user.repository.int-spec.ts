import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseModule } from 'src/infra'
import { User } from 'src/modules/user/entities'
import { GetInactiveUsersListQueryDTO, UpdateUserDTO } from 'src/modules/user/http'
import { addRawUser, resetDb } from 'test/automation/database'
import { DataSource } from 'typeorm'
import { UserRepository } from './user.respository'

describe('UserRepository', () => {
  let repo: UserRepository
  let dataSource: DataSource

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [DatabaseModule, TypeOrmModule.forFeature([User])],
      providers: [UserRepository]
    }).compile()

    module.init()

    repo = module.get(UserRepository)
    dataSource = module.get(DataSource)
  })

  afterEach(async () => {
    await resetDb(dataSource)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it('should create a user', async () => {
    const user = await repo.createUser({
      name: 'name',
      email: 'email@example.com',
      password: '1234',
      picture: 'http://image.com/pic.jpg'
    })

    expect(user.email).toBe(user.email)
  })

  it('should update a user', async () => {
    const user = await addRawUser(dataSource)
    const updateDto: UpdateUserDTO = { name: 'newName' }

    const updated = await repo.update(user.id, updateDto)

    expect(updated.name).toBe(updateDto.name)
  })

  it('should find a user by params', async () => {
    const user = await addRawUser(dataSource)

    const found = await repo.findUserBy({ email: user.email })

    expect(found?.email).toBe(user.email)
  })

  it('should delete a user', async () => {
    const user = await addRawUser(dataSource)

    await repo.delete(user.id)

    const deletedUser = await repo.findUserBy({ email: user.email })

    expect(deletedUser).toBeNull()
  })

  it('Should return inactive users', async () => {
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

    const query: GetInactiveUsersListQueryDTO = {
      getSkipAndTake: () => ({ skip: 0, take: 10 })
    }

    const users = await repo.findInactiveUsersPaginated(query)

    expect(users.length).toBeGreaterThan(0)
  })
})
