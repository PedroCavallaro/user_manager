import { IsString } from 'class-validator'

export class SocialLoginDTO {
  @IsString()
  token: string
}

export class GoogleLoginReponseDTO {
  name: string
  picture: string
  email: string
  sub: string
}
