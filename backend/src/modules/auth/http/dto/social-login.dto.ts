import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class SocialLoginDTO {
  @ApiProperty()
  @IsString()
  token: string
}

export class GoogleLoginReponseDTO {
  name: string
  picture: string
  email: string
  sub: string
}
