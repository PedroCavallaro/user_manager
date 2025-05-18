import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Request } from 'express'
import { User } from 'src/modules/user/entities'
import { Repository } from 'typeorm'

// Aqui se busca no banco ao invés de usa o que está no token pois,
// se um usuário atualiza a função do outro, e ao mesmo tempo o usuário que foi atualizado faz a requisição para uma rota protegida
// o seu token vai estar desatualizado.
// com essa solução, as informações são sempre as mais novas
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest()

    const user = request.user

    const userInfo = await this.userRepository.findOne({
      where: {
        id: user.id
      }
    })

    if (!userInfo) {
      return false
    }

    return userInfo.isAdmin()
  }
}
