import { InjectQueue } from '@nestjs/bullmq'
import { HttpStatus, Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import { AppError, UseCase } from 'src/common'
import { User } from '../../entities'
import { LogAction, RoleWeight } from '../../enums'
import { UpdateUserRoleDTO } from '../../http'
import { ADD_USER_LOG_JOB, AddUserLogDTO, USER_LOG_QUEUE } from '../../infra/queue'
import { UserRepository } from '../../infra/repositories'

type Input = {
  requestorId: number
  target: UpdateUserRoleDTO
}

@Injectable()
export class UpdateUserRoleUseCase implements UseCase<Input, User> {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectQueue(USER_LOG_QUEUE) private readonly userLogQueue: Queue<AddUserLogDTO>
  ) {}

  async execute(params: Input): Promise<User> {
    const [requestor, targetUser] = await Promise.all([
      this.userRepository.findUserBy({ id: params.requestorId }),
      this.userRepository.findUserBy({ id: params.target.userId })
    ])

    if (!targetUser || !requestor) throw new AppError('User not found', HttpStatus.UNAUTHORIZED)

    if (RoleWeight[requestor.role] < RoleWeight[targetUser.role]) {
      throw new AppError('User does not haver enough permissions', HttpStatus.UNAUTHORIZED)
    }

    const updated = await this.userRepository.update(params.target.userId, {
      role: params.target.role
    })

    this.userLogQueue.add(ADD_USER_LOG_JOB, {
      requestorId: requestor.id,
      userId: targetUser.id,
      action: LogAction.UPDATE
    })

    return updated
  }
}
