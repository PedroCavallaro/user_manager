import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { UserLogRepository } from '../repositories'
import { AddUserLogDTO } from './dto'
import { ADD_USER_LOG_JOB, USER_LOG_QUEUE } from './keys'

@Processor(USER_LOG_QUEUE)
export class UserLogQueueProcessor extends WorkerHost {
  constructor(private readonly userLogRepository: UserLogRepository) {
    super()
  }

  async process(job: Job<AddUserLogDTO>): Promise<void> {
    // Aqui seria melhor ter uma pasta de jobs e orgina-los lá, e ficar mais facil de escrever testes unitários
    // porém como só tem um job, só vou checar por ele mesmo
    if (job.name !== ADD_USER_LOG_JOB) return

    await this.addLog(job.data)
  }

  async addLog(log: AddUserLogDTO) {
    await this.userLogRepository.addLog(log)
  }
}
