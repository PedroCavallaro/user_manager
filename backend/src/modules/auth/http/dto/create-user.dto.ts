import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'
import { IsSanitazedString, IsValidEmail } from 'src/common'

export class CreateUserDTO {
  @ApiProperty()
  @IsSanitazedString()
  name: string

  @ApiProperty()
  @IsValidEmail(['gmail.com', 'outlook.com', 'hotmail.com', 'conectar.com'])
  email: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  password: string
}
