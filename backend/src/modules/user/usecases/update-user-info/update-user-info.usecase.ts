import { Injectable } from '@nestjs/common'
import { UseCase } from 'src/common'
import { TokensReponseDTO } from 'src/modules/auth'
import { TokenStrategy } from 'src/modules/auth/strategies'
import { UpdateUserDTO } from '../../http'
import { UserRepository } from '../../infra/repositories'

interface Input {
  userId: number
  update: UpdateUserDTO
}

@Injectable()
export class UpdateUserInfoUseCase implements UseCase<Input, TokensReponseDTO> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenStrategy: TokenStrategy
  ) {}

  async execute(params: Input): Promise<TokensReponseDTO> {
    const updated = await this.userRepository.update(params.userId, {
      password: params.update?.password,
      name: params.update?.name
    })

    const updatedTokens = this.tokenStrategy.getTokens(updated)

    return updatedTokens
  }
}
