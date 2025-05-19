import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import { Role } from '../../enums'

export class CreateNewUserDTO {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  email: string

  @ApiProperty()
  @IsString()
  password: string

  @ApiProperty()
  @IsEnum(Role)
  role: Role
}
