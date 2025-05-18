import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoleGuard } from 'src/guards'
import { User, UserLog } from './entities'
import { UserController } from './http/user.controller'
import { USER_LOG_QUEUE } from './infra/queue/keys'
import { UserLogRepository, UserRepository } from './infra/repositories'
import { userUseCases } from './usecases'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserLog]),
    BullModule.registerQueue({
      name: USER_LOG_QUEUE,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        },
        removeOnComplete: true,
        removeOnFail: false
      }
    })
  ],
  controllers: [UserController],
  providers: [RoleGuard, UserRepository, UserLogRepository, ...userUseCases],
  exports: [UserRepository]
})
export class UserModule {}
