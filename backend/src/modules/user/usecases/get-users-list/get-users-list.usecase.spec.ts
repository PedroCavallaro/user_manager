import { Test, TestingModule } from '@nestjs/testing'
import { makeMockUser } from 'test/mocks/user'
import { User } from '../../entities'
import { GetUsersListQueryDTO } from '../../http'
import { UserRepository } from '../../infra'
import { GetUsersListUseCase } from './get-users-list.usecase'

describe('Get users list', () => {
  let useCase: GetUsersListUseCase
  let userRepository: UserRepository

  const query: GetUsersListQueryDTO = {
    page: 1,
    limit: 10
  } as GetUsersListQueryDTO

  const [user1, user2, user3] = [
    makeMockUser({ id: 1 }),
    makeMockUser({ id: 2 }),
    makeMockUser({ id: 3 })
  ]

  const users: User[] = [user1, user2, user3]

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUsersListUseCase,
        {
          provide: UserRepository,
          useValue: {
            findPaginated: jest.fn()
          }
        }
      ]
    }).compile()

    useCase = module.get(GetUsersListUseCase)
    userRepository = module.get(UserRepository)
  })

  it('Should return a list of users', async () => {
    jest.spyOn(userRepository, 'findPaginated').mockResolvedValue([users, users.length])

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

  it('Should paginate the list of  users', async () => {
    jest.spyOn(userRepository, 'findPaginated').mockResolvedValue([[user2], 1])

    const queryToUse: GetUsersListQueryDTO = {
      page: 2,
      limit: 1
    } as GetUsersListQueryDTO

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
