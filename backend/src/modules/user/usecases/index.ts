import { DeleteUserUseCase } from './delete-user/delete-user.usecase'
import { GetInactiveUsersUseCase } from './get-inactive-users/get-inactive-users.usecase'
import { GetUsersListUseCase } from './get-users-list/get-users-list.usecase'
import { UpdateUserInfoUseCase } from './update-user-info/update-user-info.usecase'
import { UpdateUserRoleUseCase } from './update-user-role/update-user-role.usecase'

export * from './get-users-list/get-users-list.usecase'
export * from './delete-user/delete-user.usecase'
export * from './update-user-info/update-user-info.usecase'
export * from './update-user-role/update-user-role.usecase'
export * from './get-inactive-users/get-inactive-users.usecase'

export const userUseCases = [
  GetUsersListUseCase,
  DeleteUserUseCase,
  UpdateUserInfoUseCase,
  GetInactiveUsersUseCase,
  UpdateUserRoleUseCase
]
