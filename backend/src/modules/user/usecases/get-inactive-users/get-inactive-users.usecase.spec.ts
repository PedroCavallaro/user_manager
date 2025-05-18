import { Test, TestingModule } from '@nestjs/testing'
import { makeMockUser } from 'test/mocks/user'
import { User } from '../../entities'
import { GetInactiveUsersListQueryDTO } from '../../http'
import { UserRepository } from '../../infra'
import { GetInactiveUsersUseCase } from './get-inactive-users.usecase'

describe('Get inactive users list', () => {
  let useCase: GetInactiveUsersUseCase
  let userRepository: UserRepository

  const query: GetInactiveUsersListQueryDTO = {
    page: 1,
    limit: 10
  } as GetInactiveUsersListQueryDTO

  const [user1, user2, user3] = [
    makeMockUser({ id: 1 }),
    makeMockUser({ id: 2 }),
    makeMockUser({ id: 3 })
  ]

  const users: User[] = [user1, user2, user3]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetInactiveUsersUseCase,
        {
          provide: UserRepository,
          useValue: {
            findInactiveUsersPaginated: jest.fn()
          }
        }
      ]
    }).compile()

    useCase = module.get(GetInactiveUsersUseCase)
    userRepository = module.get(UserRepository)
  })

  it('Should return a list of inactive users', async () => {
    jest.spyOn(userRepository, 'findInactiveUsersPaginated').mockResolvedValue(users)

    const result = await useCase.execute(query)

    expect(result).toEqual(
      expect.objectContaining({
        page: query.page,
        data: [
          expect.objectContaining({ id: user1.id }),
          expect.objectContaining({ id: user2.id }),
          expect.objectContaining({ id: user3.id })
        ]
      })
    )
  })

  it('Should paginate the list of inactive users', async () => {
    jest.spyOn(userRepository, 'findInactiveUsersPaginated').mockResolvedValue([user2])

    const queryToUse: GetInactiveUsersListQueryDTO = {
      page: 2,
      limit: 1
    } as GetInactiveUsersListQueryDTO

    const result = await useCase.execute(queryToUse)

    expect(result).toEqual(
      expect.objectContaining({
        page: queryToUse.page,
        total: 1,
        totalPages: 1,
        data: [
          expect.objectContaining({
            id: user2.id
          })
        ]
      })
    )
  })
})
