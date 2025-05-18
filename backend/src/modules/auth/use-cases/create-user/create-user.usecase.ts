import { HttpStatus, Injectable } from '@nestjs/common'
import { AppError, UseCase } from 'src/common'
import { UserRepository } from 'src/modules/user'
import { CreateUserDTO, TokensReponseDTO } from '../../http'
import { HashStrategy, TokenStrategy } from '../../strategies'

@Injectable()
export class CreateUserUseCase implements UseCase<CreateUserDTO, TokensReponseDTO> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashStrategy: HashStrategy,
    private readonly tokenStrategy: TokenStrategy
  ) {}

  async execute(params: CreateUserDTO): Promise<TokensReponseDTO> {
    let user = await this.userRepository.findUserBy({
      email: params.email
    })

    if (user) {
      throw new AppError('User already exists', HttpStatus.FORBIDDEN)
    }

    console.log(params.password)
    const hashedPassword = await this.hashStrategy.hash(params.password)

    user = await this.userRepository.createUser({
      ...params,
      password: hashedPassword
    })

    const tokens = this.tokenStrategy.getTokens(user)

    return tokens
  }
}
