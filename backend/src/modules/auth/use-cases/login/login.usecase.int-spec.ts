import { HttpStatus } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from 'src/app.module'
import { AppError } from 'src/common'
import { User } from 'src/modules/user'
import { addRawUser, resetDb } from 'test/automation/database'
import { DataSource } from 'typeorm'
import { HashStrategy } from '../../strategies'
import { LoginUseCase } from './login.usecase'

describe('LoginUseCase', () => {
  let useCase: LoginUseCase
  let dataSource: DataSource
  let hashStrategy: HashStrategy
  let user: User

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    module.init()

    useCase = module.get(LoginUseCase)
    dataSource = module.get(DataSource)
    hashStrategy = module.get(HashStrategy)

    const hash = await hashStrategy.hash('123')
    user = await addRawUser(dataSource, { password: hash })
  })

  afterAll(async () => {
    await resetDb(dataSource)

    await dataSource.destroy()
  })
  it('Should login', async () => {
    const result = await useCase.execute({
      login: {
        email: user.email,
        password: '123'
      },
      ip: '127.0.0.1'
    })

    expect(result).toHaveProperty('token')
    expect(result).toHaveProperty('refresh')
  })

  it('Should throw if user not exists', async () => {
    const error = new AppError('Usuário não encontrado', HttpStatus.NOT_FOUND)

    await expect(
      useCase.execute({
        login: { email: 'ababab@email.com', password: '123123' }
      })
    ).rejects.toThrow(error)
  })

  it('Should throw if password is incorrect', async () => {
    const error = new AppError('Senha incorreta', HttpStatus.UNAUTHORIZED)

    await expect(
      useCase.execute({
        login: { email: user.email, password: 'abababa' }
      })
    ).rejects.toThrow(error)
  })
})
