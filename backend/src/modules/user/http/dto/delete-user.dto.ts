import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString } from 'class-validator'

export class DeleteUserDTO {
  @ApiProperty()
  @Type(() => Number)
  @IsString()
  userId: number
}
