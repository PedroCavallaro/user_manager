import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { ThrottlerGuard } from '@nestjs/throttler'
import { Request, Response } from 'express'
import { Public } from 'src/common'
import { TokenStrategy } from '../strategies'
import { CreateUserUseCase, LoginUseCase } from '../use-cases'
import { CreateUserDTO, LoginDTO, RefreshTokensDTO, TokensReponseDTO } from './dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly tokenStrategy: TokenStrategy
  ) {}

  @Public()
  @ApiOkResponse({ type: TokensReponseDTO })
  @Post('/register')
  async register(@Body() body: CreateUserDTO) {
    const res = await this.createUserUseCase.execute(body)

    return res
  }

  // Isso aqui dificulta bastante ataques de brute force
  @UseGuards(ThrottlerGuard)
  @Public()
  @ApiOkResponse({ type: TokensReponseDTO })
  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response, @Body() body: LoginDTO) {
    try {
      const data = await this.loginUseCase.execute({
        login: body,
        ip: req.ip
      })

      return res.status(HttpStatus.OK).send(data)
    } catch (e) {
      return res.status(e.status).send({ ...e, name: undefined })
    }
  }

  @Public()
  @ApiOkResponse({ type: TokensReponseDTO })
  @Post('/refresh')
  async refresh(@Body() body: RefreshTokensDTO) {
    return this.tokenStrategy.refresh(body.refresh)
  }
}
