import { Injectable } from '@nestjs/common'
import { IPagination, Pagination, UseCase } from 'src/common'
import { GetUserListResponseDTO, GetUsersListQueryDTO } from '../../http'
import { UserRepository } from '../../infra'

@Injectable()
export class GetUsersListUseCase
  implements UseCase<GetUsersListQueryDTO, IPagination<GetUserListResponseDTO[]>>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(params: GetUsersListQueryDTO): Promise<IPagination<GetUserListResponseDTO[]>> {
    const [users, count] = await this.userRepository.findPaginated(params)

    const res: GetUserListResponseDTO[] = users.map((e) => ({
      id: e.id,
      name: e.name,
      email: e.email,
      role: e.role,
      isActive: e.isActive()
    }))

    return new Pagination<GetUserListResponseDTO[]>()
      .setData(res)
      .setPage(params.page)
      .setTotal(count, params.limit)
      .build()
  }
}
