import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { IPagination, Pagination } from 'src/common'
import { UserJwtPayload } from 'src/global'
import { RoleGuard } from 'src/guards'
import { mockUseCase } from 'test/mocks/use-case'
import { makeMockUser } from 'test/mocks/user'
import {
  DeleteUserDTO,
  GetInactiveUsersListQueryDTO,
  GetInactiveUsersListReponseDTO,
  GetUserListResponseDTO,
  GetUsersListQueryDTO,
  UpdateUserDTO,
  UpdateUserRoleDTO,
  UserController
} from '.'
import { User } from '../entities'
import { Role } from '../enums'
import {
  DeleteUserUseCase,
  GetInactiveUsersUseCase,
  GetUsersListUseCase,
  UpdateUserInfoUseCase,
  UpdateUserRoleUseCase
} from '../usecases'

describe('User controller', () => {
  let controller: UserController
  let getUsersListUseCase: GetUsersListUseCase
  let deleteUserUseCase: DeleteUserUseCase
  let updateUserInfoUseCase: UpdateUserInfoUseCase
  let updateUserRoleUseCase: UpdateUserRoleUseCase
  let getInactiveUsersUseCase: GetInactiveUsersUseCase

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        RoleGuard,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn()
          }
        },
        mockUseCase(GetUsersListUseCase),
        mockUseCase(DeleteUserUseCase),
        mockUseCase(UpdateUserInfoUseCase),
        mockUseCase(UpdateUserRoleUseCase),
        mockUseCase(GetInactiveUsersUseCase)
      ]
    }).compile()

    deleteUserUseCase = module.get<DeleteUserUseCase>(DeleteUserUseCase)
    updateUserRoleUseCase = module.get<UpdateUserRoleUseCase>(UpdateUserRoleUseCase)
    updateUserInfoUseCase = module.get<UpdateUserInfoUseCase>(UpdateUserInfoUseCase)
    getUsersListUseCase = module.get<GetUsersListUseCase>(GetUsersListUseCase)
    getInactiveUsersUseCase = module.get<GetInactiveUsersUseCase>(GetInactiveUsersUseCase)
    controller = module.get<UserController>(UserController)
  })

  const mockPagination = <T>(data: T[] = [], page = 1, limit = 10) => {
    return new Pagination<T[]>().setData(data).setPage(page).setTotal(data.length, limit).build()
  }

  describe('getUsersList', () => {
    it('Should return users list', async () => {
      const query: GetUsersListQueryDTO = { page: 1, limit: 10 } as GetUsersListQueryDTO
      const expected: IPagination<GetUserListResponseDTO[]> = mockPagination([
        {
          ...makeMockUser(),
          isActive: true
        }
      ])

      jest.spyOn(getUsersListUseCase, 'execute').mockResolvedValue(expected)

      const result = await controller.getUsersList(query)

      expect(getUsersListUseCase.execute).toHaveBeenCalledWith(query)
      expect(result).toBe(expected)
    })
  })

  describe('getInactiveUsersList', () => {
    it('should return inactive users list', async () => {
      const query: GetInactiveUsersListQueryDTO = {
        page: 1,
        limit: 10
      } as GetInactiveUsersListQueryDTO

      const expected: IPagination<GetInactiveUsersListReponseDTO[]> = mockPagination([
        makeMockUser()
      ])

      jest.spyOn(getInactiveUsersUseCase, 'execute').mockResolvedValue(expected)

      const result = await controller.getInactiveUsersList(query)

      expect(getInactiveUsersUseCase.execute).toHaveBeenCalledWith(query)
      expect(result).toBe(expected)
    })
  })

  describe('updateUserInfo', () => {
    it('should update user info', async () => {
      const user = { sub: 1 } as UserJwtPayload
      const body: UpdateUserDTO = { name: 'name' }
      const updatedUser = makeMockUser({ name: 'name', email: 'email@email.com' })

      jest.spyOn(updateUserInfoUseCase, 'execute').mockResolvedValue(updatedUser)

      const result = await controller.updateUserInfo(user, body)

      expect(updateUserInfoUseCase.execute).toHaveBeenCalledWith({
        userId: user.sub,
        update: body
      })

      expect(result).toBe(updatedUser)
    })
  })

  describe('updateUserRole', () => {
    it('should update user role', async () => {
      const user = { sub: 1 } as UserJwtPayload
      const body: UpdateUserRoleDTO = { userId: 2, role: Role.ADMIN }
      const updatedUser = { id: 2, role: Role.ADMIN } as User

      jest.spyOn(updateUserRoleUseCase, 'execute').mockResolvedValue(updatedUser)

      const result = await controller.updateUserRole(user, body)

      expect(updateUserRoleUseCase.execute).toHaveBeenCalledWith({
        requestorId: user.sub,
        target: body
      })

      expect(result).toBe(updatedUser)
    })
  })

  describe('deleteUser', () => {
    it('should delete user', async () => {
      const user = { sub: 1 } as UserJwtPayload
      const params: DeleteUserDTO = { userId: 2 }

      jest.spyOn(deleteUserUseCase, 'execute').mockResolvedValue(undefined)

      const result = await controller.deleteUser(user, params)

      expect(deleteUserUseCase.execute).toHaveBeenCalledWith({
        requestorId: user.sub,
        userId: params.userId
      })

      expect(result).toBeUndefined()
    })
  })
})
