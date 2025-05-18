import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserLog } from '../../../entities'
import { LogAction } from '../../../enums'
import { AddUserLogDTO } from '../../queue'
import { UserLogRepository } from './user-log.repository'

describe('UserLogRepository', () => {
  let repository: UserLogRepository
  let userLogRepo: Repository<UserLog>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserLogRepository,
        {
          provide: getRepositoryToken(UserLog),
          useValue: {
            save: jest.fn()
          }
        }
      ]
    }).compile()

    repository = module.get<UserLogRepository>(UserLogRepository)
    userLogRepo = module.get(getRepositoryToken(UserLog))
  })

  describe('addLog', () => {
    it('should save and return the log entry', async () => {
      const logData: AddUserLogDTO = {
        userId: 1,
        action: LogAction.UPDATE,
        requestorId: 2
      }

      const savedLog = {
        id: 1,
        ...logData
      } as UserLog

      jest.spyOn(userLogRepo, 'save').mockResolvedValue(savedLog)

      const result = await repository.addLog(logData)

      expect(userLogRepo.save).toHaveBeenCalledWith(logData)
      expect(result).toEqual(savedLog)
    })
  })
})
