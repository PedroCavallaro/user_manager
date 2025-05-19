import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'
import { JwtPayload, Public } from 'src/common'
import { ApiPaginatedResponse } from 'src/common/decorators/pagination-response.decorator'
import { UserJwtPayload } from 'src/global'
import { RoleGuard } from 'src/guards'
import {
  CreateNewUserUseCase,
  DeleteUserUseCase,
  GetInactiveUsersUseCase,
  GetUsersListUseCase,
  UpdateUserInfoUseCase,
  UpdateUserRoleUseCase
} from '../usecases'
import {
  CreateNewUserDTO,
  DeleteUserDTO,
  GetInactiveUsersListQueryDTO,
  GetInactiveUsersListReponseDTO,
  GetUserListResponseDTO,
  GetUsersListQueryDTO,
  UpdateUserDTO,
  UpdateUserRoleDTO
} from './dto'

@Controller('user')
export class UserController {
  constructor(
    private readonly getUsersListUseCase: GetUsersListUseCase,
    private readonly getInactiveUsersListUseCase: GetInactiveUsersUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly updateUserUseInfoCase: UpdateUserInfoUseCase,
    private readonly updateUserRoleUseCase: UpdateUserRoleUseCase,
    private readonly createNewUserUseCase: CreateNewUserUseCase
  ) {}

  @ApiPaginatedResponse(GetUserListResponseDTO)
  @UseGuards(RoleGuard)
  @Get('')
  async getUsersList(@Query() query: GetUsersListQueryDTO) {
    const res = await this.getUsersListUseCase.execute(query)

    return res
  }

  @ApiOkResponse()
  @Public()
  @Post('create')
  async createUser(@Body() body: CreateNewUserDTO) {
    await this.createNewUserUseCase.execute(body)
  }

  @ApiPaginatedResponse(GetInactiveUsersListReponseDTO)
  @UseGuards(RoleGuard)
  @Get('inactive')
  async getInactiveUsersList(@Query() query: GetInactiveUsersListQueryDTO) {
    const res = await this.getInactiveUsersListUseCase.execute(query)

    return res
  }

  @ApiOkResponse()
  @Patch()
  async updateUserInfo(@JwtPayload() user: UserJwtPayload, @Body() body: UpdateUserDTO) {
    const res = await this.updateUserUseInfoCase.execute({
      userId: user.sub,
      update: body
    })

    return res
  }

  @ApiOkResponse()
  @UseGuards(RoleGuard)
  @Patch('role')
  async updateUserRole(@JwtPayload() user: UserJwtPayload, @Body() body: UpdateUserRoleDTO) {
    const res = await this.updateUserRoleUseCase.execute({
      target: body,
      requestorId: user.sub
    })

    return res
  }

  @ApiOkResponse()
  @UseGuards(RoleGuard)
  @Delete('/:userId')
  async deleteUser(@JwtPayload() user: UserJwtPayload, @Param() params: DeleteUserDTO) {
    const res = await this.deleteUserUseCase.execute({
      userId: params.userId,
      requestorId: user.sub
    })

    return res
  }
}
