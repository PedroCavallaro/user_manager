import { Injectable } from '@nestjs/common'
import { UseCase } from 'src/common'
import { HashStrategy } from 'src/modules/auth/strategies'
import { User } from '../../entities'
import { CreateNewUserDTO } from '../../http'
import { UserRepository } from '../../infra'

@Injectable()
export class CreateNewUserUseCase implements UseCase<CreateNewUserDTO, User> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashStrategy: HashStrategy
  ) {}

  async execute(params: CreateNewUserDTO): Promise<User> {
    const hashed = await this.hashStrategy.hash(params.password)

    const user = await this.userRepository.createUser({ ...params, password: hashed })

    return user
  }
}
