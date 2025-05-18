import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User, UserLog } from 'src/modules/user/entities'
import { DATABASE_CONFIG } from './config'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      database: DATABASE_CONFIG.database,
      url: DATABASE_CONFIG.url,
      entities: [User, UserLog]
    })
  ]
})
export class DatabaseModule {}
