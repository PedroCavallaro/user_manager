import { CreateUserUseCase } from './create-user/create-user.usecase'
import { LoginUseCase } from './login/login.usecase'
import { SocialLoginUseCase } from './social-login/social-login.usecase'

export * from './login/login.usecase'
export * from './create-user/create-user.usecase'
export * from './social-login/social-login.usecase'

export const authUseCases = [CreateUserUseCase, LoginUseCase, SocialLoginUseCase]
