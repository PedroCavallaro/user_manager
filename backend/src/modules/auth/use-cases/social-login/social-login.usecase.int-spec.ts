import { Test } from '@nestjs/testing'
import * as nock from 'nock'
import { AppModule } from 'src/app.module'
import { UserRepository } from 'src/modules/user'
import { DataSource } from 'typeorm'
import { SocialLoginUseCase } from './social-login.usecase'

describe('SocialLoginUseCase', () => {
  let useCase: SocialLoginUseCase
  let dataSource: DataSource
  let userRepository: UserRepository

  const mockGoogleToken = 'token'
  const mockGoogleResponse = {
    email: 'user@example.com',
    name: 'user',
    picture: 'https://google.com/picture.jpg'
  }

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    module.init()

    useCase = module.get(SocialLoginUseCase)
    dataSource = module.get(DataSource)
    userRepository = module.get(UserRepository)

    nock('https://www.googleapis.com')
      .get('/oauth2/v3/userinfo')
      .matchHeader('Authorization', `Bearer ${mockGoogleToken}`)
      .reply(200, mockGoogleResponse)
  })

  afterAll(async () => {
    await dataSource.destroy()
  })

  it('Should log user using google', async () => {
    const tokens = await useCase.execute({ token: mockGoogleToken })

    expect(tokens).toHaveProperty('token')
    expect(tokens).toHaveProperty('refresh')

    const user = await userRepository.findUserBy({ email: mockGoogleResponse.email })

    expect(user).toBeDefined()
    expect(user?.name).toBe(mockGoogleResponse.name)
  })
})
