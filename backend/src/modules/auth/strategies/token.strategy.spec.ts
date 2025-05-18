import * as crypto from 'crypto'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { Cache } from 'cache-manager'
import { AppError } from 'src/common'
import { TokenStrategy } from 'src/modules/auth/strategies'
import { makeMockUser } from 'test/mocks/user'

describe('TokenStrategy', () => {
  let strategy: TokenStrategy
  let jwtService: jest.Mocked<JwtService>
  let cache: jest.Mocked<Cache>

  const user = makeMockUser()

  const accessToken = 'access-token'
  const refreshToken = 'refresh-token'

  beforeEach(async () => {
    process.env.JWT_SECRET = 'jwt-secret'
    process.env.JWT_EXPIRES_IN = '1h'
    process.env.REFRESH_SECRET = 'refresh-secret'
    process.env.REFRESH_EXPIRES_IN = '7d'

    cache = {
      set: jest.fn(),
      get: jest.fn(),
      del: jest.fn()
    } as any

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenStrategy,
        {
          provide: CACHE_MANAGER,
          useValue: cache
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValueOnce(accessToken).mockReturnValueOnce(refreshToken),
            verify: jest.fn()
          }
        }
      ]
    }).compile()

    strategy = module.get(TokenStrategy)
    jwtService = module.get(JwtService)
  })

  it('Should return payload if type is access', async () => {
    const payload = { type: 'access' }
    const result = await strategy.validate(payload)

    expect(result).toEqual(payload)
  })

  it('Should throw AppError if type is not access', async () => {
    await expect(strategy.validate({ type: 'refresh' })).rejects.toThrow(AppError)
  })

  it('Should return access and refresh tokens and cache the refresh token', async () => {
    const tokens = await strategy.getTokens(user)

    expect(jwtService.sign).toHaveBeenCalledTimes(2)
    expect(cache.set).toHaveBeenCalledWith(expect.any(String), refreshToken)
    expect(tokens).toEqual({
      token: accessToken,
      refresh: refreshToken
    })
  })

  it('Should return new tokens and delete old refresh token', async () => {
    const key = crypto.createHash('sha256').update(refreshToken).digest('hex')

    jest.spyOn(cache, 'get').mockResolvedValue(refreshToken)
    jest.spyOn(jwtService, 'verify').mockReturnValue(user)

    const tokens = await strategy.refresh(refreshToken)

    expect(cache.get).toHaveBeenCalledWith(key)
    expect(jwtService.verify).toHaveBeenCalledWith(refreshToken, {
      secret: process.env.REFRESH_SECRET
    })
    expect(cache.del).toHaveBeenCalledWith(key)
    expect(tokens).toEqual({
      token: accessToken,
      refresh: refreshToken
    })
  })

  it('Should throw UnauthorizedException if token is not in cache', async () => {
    jest.spyOn(cache, 'get').mockResolvedValue(undefined)

    await expect(strategy.refresh(refreshToken)).rejects.toThrow(UnauthorizedException)
  })

  it('should throw UnauthorizedException if verify fails', async () => {
    jest.spyOn(cache, 'get').mockResolvedValue(refreshToken)

    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      throw new Error()
    })

    await expect(strategy.refresh(refreshToken)).rejects.toThrow(UnauthorizedException)
  })
})
