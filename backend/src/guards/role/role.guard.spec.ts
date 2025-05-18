import { ExecutionContext } from '@nestjs/common'
import { User } from 'src/modules/user/entities'
import { makeMockUser } from 'test/mocks/user'
import { Repository } from 'typeorm'
import { RoleGuard } from './role.guard'

describe('RoleGuard', () => {
  let roleGuard: RoleGuard
  let userRepository: jest.Mocked<Repository<User>>

  const mockUser = makeMockUser({})

  beforeEach(() => {
    userRepository = {
      findOne: jest.fn()
    } as unknown as jest.Mocked<Repository<User>>

    roleGuard = new RoleGuard(userRepository)
  })

  const mockExecutionContext = (user: any): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({ user })
      })
    }) as unknown as ExecutionContext

  it('Should return true if user is admin', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue({
      ...mockUser,
      isAdmin: () => true
    } as User)

    const context = mockExecutionContext({ id: 1 })

    const result = await roleGuard.canActivate(context)

    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 }
    })
    expect(result).toBe(true)
  })

  it('Should return false if user is not admin', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue({
      ...mockUser,
      isAdmin: () => false
    } as User)

    const context = mockExecutionContext({ id: 1 })

    const result = await roleGuard.canActivate(context)

    expect(result).toBe(false)
  })

  it('should return false if user not found', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null)

    const context = mockExecutionContext({ id: 123 })

    const result = await roleGuard.canActivate(context)

    expect(result).toBe(false)
  })
})
