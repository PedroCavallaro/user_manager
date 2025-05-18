import { BullModule } from '@nestjs/bullmq'
import { CacheModule } from '@nestjs/cache-manager'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ThrottlerModule } from '@nestjs/throttler'
import { AppController } from './app.controller'
import { JwtGuard } from './guards'
import { CacheService, DatabaseModule } from './infra'
import { ApiKeyMiddleware } from './middlewares'
import { AuthModule, UserModule } from './modules'

@Module({
  imports: [
    DatabaseModule,
    BullModule.forRoot({
      connection: {
        host: process.env.CACHE_HOST,
        port: process.env.CACHE_PORT
      }
    }),
    UserModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PassportModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: CacheService
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: process.env.JWT_SECRET
      })
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: process.env.THROTTLE_TTL,
          limit: process.env.THROTTLE_LIMIT
        }
      ]
    })
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiKeyMiddleware).forRoutes('*')
  }
}
