import { HttpStatus, Injectable } from '@nestjs/common'
import { AppError, UseCase } from 'src/common'
import { UserRepository } from 'src/modules/user'
import { LoginDTO, TokensReponseDTO } from '../../http'
import { HashStrategy, TokenStrategy } from '../../strategies'

interface Input {
  login: LoginDTO
  ip?: string
}

@Injectable()
export class LoginUseCase implements UseCase<Input, TokensReponseDTO> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashStrategy: HashStrategy,
    private readonly tokenStrategy: TokenStrategy
  ) {}

  async execute(params: Input): Promise<TokensReponseDTO> {
    const { login, ip } = params

    const user = await this.userRepository.findUserBy({
      email: login.email
    })

    if (!user) {
      throw new AppError('User not found', HttpStatus.NOT_FOUND)
    }

    const passwordMatch = await this.hashStrategy.verify(login.password, user.password)

    if (!passwordMatch) {
      throw new AppError('Incorrect password', HttpStatus.UNAUTHORIZED)
    }

    if (user.lastIpUsed && ip !== user.lastIpUsed) {
      // Aqui poderia ser enviado um email notificando um usuário que houve um novo acesse de um local diferente,
      // ai ele poderia confirmar e fazer login de novo, ou recusar e ser redirecionado para a troca de senha
      // a implmentação levaria um tempo, então vou deixar aqui como uma possível melhoria
      console.log('Diferent login ip detected')
    }

    const tokens = this.tokenStrategy.getTokens(user)

    this.userRepository.update(user.id, { loggedAt: new Date() })

    return tokens
  }
}
