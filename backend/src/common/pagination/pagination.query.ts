import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class PaginationQueryDTO {
  @IsOptional()
  @IsString()
  query?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10

  getSkipAndTake() {
    const page = this.page ?? 1
    const limit = this.limit ?? 10

    const skip = page - 1 === 0 ? 0 : page * limit - limit

    return {
      skip,
      take: this.limit
    }
  }
}
