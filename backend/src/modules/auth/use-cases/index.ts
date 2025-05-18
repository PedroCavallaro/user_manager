import { CreateUserUseCase } from './create-user/create-user.usecase'
import { LoginUseCase } from './login/login.usecase'

export * from './login/login.usecase'
export * from './create-user/create-user.usecase'

export const authUseCases = [CreateUserUseCase, LoginUseCase]
