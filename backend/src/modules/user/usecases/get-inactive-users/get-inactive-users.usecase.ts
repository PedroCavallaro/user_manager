import { Injectable } from '@nestjs/common'
import { IPagination, Pagination, UseCase } from 'src/common'
import { GetInactiveUsersListQueryDTO, GetInactiveUsersListReponseDTO } from '../../http'
import { UserRepository } from '../../infra/repositories'

@Injectable()
export class GetInactiveUsersUseCase
  implements UseCase<GetInactiveUsersListQueryDTO, IPagination<GetInactiveUsersListReponseDTO[]>>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    params: GetInactiveUsersListQueryDTO
  ): Promise<IPagination<GetInactiveUsersListReponseDTO[]>> {
    const users = await this.userRepository.findInactiveUsersPaginated(params)

    const res: GetInactiveUsersListReponseDTO[] = users.map((e) => ({
      id: e.id,
      name: e.name,
      email: e.email,
      role: e.role,
      inactiveSince: e.loggedAt,
      profileImage: e.profileImage
    }))

    return new Pagination<GetInactiveUsersListReponseDTO[]>()
      .setData(res)
      .setPage(params?.page)
      .setTotal(users.length, params?.limit)
      .build()
  }
}
