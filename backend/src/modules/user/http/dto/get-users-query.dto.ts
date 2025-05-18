import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsIn, IsNumber, IsOptional } from 'class-validator'
import { PaginationQueryDTO } from 'src/common'
import { Role } from '../../enums'

// Esse sortBy e order poderiam estar em uma outra class utilitaria
// porém como o projeto é simples e só vai ter esse endpoint de listagem, vou agregar tudo nessa classe
export class GetUsersListQueryDTO extends PaginationQueryDTO {
  @ApiProperty()
  @IsOptional()
  @IsEnum(Role)
  role?: Role

  @ApiProperty()
  @IsIn(['email', 'name', 'role', 'id'])
  @IsOptional()
  sortBy?: string = 'id'

  @ApiProperty({ enum: ['asc', 'desc'] })
  @IsIn(['asc', 'desc'])
  @IsOptional()
  order?: 'asc' | 'desc' = 'asc'
}

export class GetUserListResponseDTO {
  @ApiProperty()
  name: string

  @ApiProperty()
  isActive: boolean

  @ApiProperty()
  role: Role

  @ApiProperty()
  email: string

  @ApiProperty()
  profileImage?: string
}

export class GetInactiveUsersListQueryDTO extends GetUsersListQueryDTO {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  days?: number = 30
}

export class GetInactiveUsersListReponseDTO {
  @ApiProperty()
  name?: string

  @ApiProperty()
  role?: Role

  @ApiProperty()
  email?: string

  @ApiProperty()
  profileImage?: string

  @ApiProperty()
  inactiveSince?: Date
}
