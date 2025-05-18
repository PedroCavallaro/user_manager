import { ApiProperty } from '@nestjs/swagger'

export class TokensReponseDTO {
  @ApiProperty()
  token: string

  @ApiProperty()
  refresh: string
}
