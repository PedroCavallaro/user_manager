import { HttpService } from '@nestjs/axios'
import { Test, TestingModule } from '@nestjs/testing'
import { UserRepository } from 'src/modules/user'
import { makeMockUser } from 'test/mocks/user'
import { GoogleLoginReponseDTO, TokensReponseDTO } from '../../http'
import { TokenStrategy } from '../../strategies'
import { SocialLoginUseCase } from './social-login.usecase'

describe('SocialLoginUseCase', () => {
  let useCase: SocialLoginUseCase
  let userRepository: jest.Mocked<UserRepository>
  let tokenStrategy: jest.Mocked<TokenStrategy>
  let httpService: jest.Mocked<HttpService>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocialLoginUseCase,
        {
          provide: UserRepository,
          useValue: {
            findUserBy: jest.fn(),
            createUser: jest.fn()
          }
        },
        {
          provide: TokenStrategy,
          useValue: {
            getTokens: jest.fn()
          }
        },
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: jest.fn()
            }
          }
        }
      ]
    }).compile()

    useCase = module.get(SocialLoginUseCase)
    userRepository = module.get(UserRepository)
    tokenStrategy = module.get(TokenStrategy)
    httpService = module.get(HttpService)
  })

  it('should create a user and return tokens if user does not exist', async () => {
    const mockToken = 'mock_google_token'
    const mockGoogleData: GoogleLoginReponseDTO = {
      sub: '123',
      name: 'John Doe',
      email: 'john@example.com',
      picture: 'http://example.com/john.jpg'
    }
    const mockTokens: TokensReponseDTO = {
      token: 'access_token',
      refresh: 'refresh_token'
    }
    const mockUser = makeMockUser()

    jest.spyOn(httpService.axiosRef, 'get').mockResolvedValueOnce({
      data: mockGoogleData
    })
    jest.spyOn(userRepository, 'findUserBy').mockResolvedValueOnce(null)
    jest.spyOn(userRepository, 'createUser').mockResolvedValueOnce(mockUser)
    jest.spyOn(tokenStrategy, 'getTokens').mockResolvedValueOnce(mockTokens)

    const result = await useCase.execute({ token: mockToken })

    expect(httpService.axiosRef.get).toHaveBeenCalledWith(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: `Bearer ${mockToken}` } }
    )
    expect(userRepository.findUserBy).toHaveBeenCalledWith({ email: mockGoogleData.email })
    expect(userRepository.createUser).toHaveBeenCalledWith({
      name: mockGoogleData.name,
      email: mockGoogleData.email,
      picture: mockGoogleData.picture
    })
    expect(tokenStrategy.getTokens).toHaveBeenCalledWith(mockUser)
    expect(result).toEqual(mockTokens)
  })

  it('should return tokens for an existing user', async () => {
    const mockToken = 'mock_google_token'
    const mockGoogleData: GoogleLoginReponseDTO = {
      sub: '123',
      name: 'John Doe',
      email: 'john@example.com',
      picture: 'http://example.com/john.jpg'
    }
    const mockUser = makeMockUser()
    const mockTokens: TokensReponseDTO = {
      token: 'access_token',
      refresh: 'refresh_token'
    }

    jest.spyOn(httpService.axiosRef, 'get').mockResolvedValueOnce({ data: mockGoogleData })
    jest.spyOn(userRepository, 'findUserBy').mockResolvedValueOnce(mockUser)
    jest.spyOn(tokenStrategy, 'getTokens').mockResolvedValueOnce(mockTokens)

    const result = await useCase.execute({ token: mockToken })

    expect(userRepository.createUser).not.toHaveBeenCalled()
    expect(result).toEqual(mockTokens)
  })
})
