import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateUserDTO } from 'src/modules/auth'
import { User } from 'src/modules/user/entities'
import { Role } from 'src/modules/user/enums'
import { GetInactiveUsersListQueryDTO, GetUsersListQueryDTO } from 'src/modules/user/http'
import { FindOneOptions, LessThan, Like, Repository } from 'typeorm'

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async update(userId: number, dto: Partial<User>) {
    const updated = await this.userRepository.save({
      id: userId,
      ...dto
    })

    return updated
  }

  async createUser(dto: CreateUserDTO): Promise<User> {
    const user = await this.userRepository.save({
      name: dto.name,
      email: dto.email,
      role: Role.USER,
      password: dto.password
    })

    return user
  }

  async findUserBy(params: FindOneOptions<User>['where']) {
    const user = await this.userRepository.findOne({
      where: {
        ...params
      }
    })

    return user
  }

  async findManyUsersBy(params: FindOneOptions<User>['where']) {
    const user = await this.userRepository.find({
      where: {
        ...params
      }
    })

    return user
  }

  async findPaginated(query: GetUsersListQueryDTO): Promise<[User[], number]> {
    const { skip, take } = query.getSkipAndTake()

    const order = query?.sortBy ?? 'id'

    const [users, count] = await Promise.all([
      this.userRepository.find({
        where: {
          email: query?.query ? Like(`%${query?.query}%`) : undefined,
          role: query?.role ? query?.role : undefined
        },
        order: {
          [order]: query.order
        },
        skip,
        take
      }),
      this.userRepository.count()
    ])

    return [users, count]
  }

  async findInactiveUsersPaginated(query: GetInactiveUsersListQueryDTO) {
    const { skip, take } = query.getSkipAndTake()

    const order = query?.sortBy ?? 'id'

    const inactiveSince = new Date(Date.now() - query.days! * 24 * 60 * 60 * 1000)

    const users = await this.userRepository.find({
      where: {
        email: query.query,
        loggedAt: LessThan(inactiveSince)
      },
      order: {
        [order]: query.order
      },
      skip,
      take
    })

    return users
  }

  async delete(userId: number) {
    const deleted = await this.userRepository.softDelete({
      id: userId
    })

    return deleted
  }
}
