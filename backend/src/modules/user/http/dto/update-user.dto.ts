import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateUserDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  password?: string
}
