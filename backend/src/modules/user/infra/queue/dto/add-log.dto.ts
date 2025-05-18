import { LogAction } from 'src/modules/user/enums'

export interface AddUserLogDTO {
  userId: number
  requestorId: number
  action: LogAction
}
