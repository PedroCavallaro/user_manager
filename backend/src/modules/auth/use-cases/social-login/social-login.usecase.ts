import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { UseCase } from 'src/common'
import { UserRepository } from 'src/modules/user'
import { GoogleLoginReponseDTO, SocialLoginDTO, TokensReponseDTO } from '../../http'
import { TokenStrategy } from '../../strategies'

@Injectable()
export class SocialLoginUseCase implements UseCase<SocialLoginDTO, TokensReponseDTO> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenStrategy: TokenStrategy,
    private readonly http: HttpService
  ) {}

  async execute({ token }: SocialLoginDTO): Promise<TokensReponseDTO> {
    const response = await this.http.axiosRef.get<GoogleLoginReponseDTO>(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const userInfo = response.data

    let user = await this.userRepository.findUserBy({ email: userInfo.email })

    if (!user) {
      user = await this.userRepository.createUser({
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture
      })
    }

    const tokens = await this.tokenStrategy.getTokens(user)

    return tokens
  }
}
