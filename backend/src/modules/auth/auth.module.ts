import { Module } from '@nestjs/common'
import { UserModule } from '../user'
import { AuthController } from './http'
import { HashStrategy, TokenStrategy } from './strategies'
import { authUseCases } from './use-cases'

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [...authUseCases, TokenStrategy, HashStrategy]
})
export class AuthModule {}
