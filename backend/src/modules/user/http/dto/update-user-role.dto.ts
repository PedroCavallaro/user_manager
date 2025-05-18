import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNumber } from 'class-validator'
import { Role } from '../../enums'

export class UpdateUserRoleDTO {
  @ApiProperty()
  @IsNumber()
  userId: number

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role
}
