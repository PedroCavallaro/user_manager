import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserLog } from 'src/modules/user/entities'
import { Repository } from 'typeorm'
import { AddUserLogDTO } from '../../queue'

@Injectable()
export class UserLogRepository {
  constructor(
    @InjectRepository(UserLog)
    private readonly userLogRepository: Repository<UserLog>
  ) {}

  async addLog(log: AddUserLogDTO) {
    return await this.userLogRepository.save(log)
  }
}
