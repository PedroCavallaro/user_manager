import { Role } from './modules'
import { User } from './modules/user/entities'

interface UserJwtPayload {
  sub: number
  role: Role
  name: string
  email: string
  type: 'access' | 'refresh'
  picture?: string
}

interface JwtPayload extends User {
  type: 'access' | 'refresh'
}

declare module 'express' {
  interface Request {
    user: JwtPayload
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string
      CACHE_PORT: number
      CACHE_HOST: string
      GOOGLE_CLIENT_ID: string
      GOOGLE_CLIENT_SECRET: string
      CACHE_URL: string
      JWT_SECRET: string
      JWT_EXPIRES_IN: string
      REFRESH_SECRET: string
      REFRESH_EXPIRES_IN: string
      DATABASE_TYPE: string
      DATABASE_NAME: string
      DATABASE_URL: string
      THROTTLE_TTL: number
      THROTTLE_LIMIT: number
    }
  }
}
