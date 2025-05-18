import { Injectable } from '@nestjs/common'
import { UseCase } from 'src/common'
import { User } from '../../entities'
import { UpdateUserDTO } from '../../http'
import { UserRepository } from '../../infra/repositories'

interface Input {
  userId: number
  update: UpdateUserDTO
}

@Injectable()
export class UpdateUserInfoUseCase implements UseCase<Input, User> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(params: Input): Promise<User> {
    const updated = await this.userRepository.update(params.userId, {
      password: params.update?.password,
      name: params.update?.name
    })

    return updated
  }
}
