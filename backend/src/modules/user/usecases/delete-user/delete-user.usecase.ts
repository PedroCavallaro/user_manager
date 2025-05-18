import { InjectQueue } from '@nestjs/bullmq'
import { HttpStatus, Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import { AppError, UseCase } from 'src/common'
import { LogAction, RoleWeight } from '../../enums'
import { ADD_USER_LOG_JOB, AddUserLogDTO, USER_LOG_QUEUE } from '../../infra/queue'
import { UserRepository } from '../../infra/repositories'

interface Input {
  requestorId: number
  userId: number
}

@Injectable()
export class DeleteUserUseCase implements UseCase<Input, undefined> {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectQueue(USER_LOG_QUEUE) private readonly userLogQueue: Queue<AddUserLogDTO>
  ) {}

  async execute(params: Input): Promise<undefined> {
    const [requestor, targetUser] = await Promise.all([
      this.userRepository.findUserBy({ id: params.requestorId }),
      this.userRepository.findUserBy({ id: params.userId })
    ])

    if (!targetUser || !requestor) throw new AppError('User not found', HttpStatus.UNAUTHORIZED)

    if (RoleWeight[requestor.role] < RoleWeight[targetUser.role]) {
      throw new AppError('User does not have enough permissions', HttpStatus.UNAUTHORIZED)
    }

    await this.userRepository.delete(params.userId)

    this.userLogQueue.add(ADD_USER_LOG_JOB, {
      userId: targetUser.id,
      action: LogAction.DELETE,
      requestorId: requestor.id
    })
  }
}
