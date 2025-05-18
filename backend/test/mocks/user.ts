import { randomUUID } from 'crypto'
import { Role } from 'src/modules'
import { User } from 'src/modules/user/entities'

export function makeMockUser(overrides: Partial<User> = {}): User {
  return {
    name: 'jhon dow',
    pubId: randomUUID(),
    email: 'email@example.com',
    password: 'hashed',
    role: Role.USER,
    profileImage: '',
    loggedAt: null,
    id: 1,
    isActive: () => true,
    ...overrides
  } as User
}
