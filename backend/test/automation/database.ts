import { Role, User, UserLog } from 'src/modules'
import { DataSource } from 'typeorm'

export async function resetDb(dataSource: DataSource) {
  const [user, userLogs] = [dataSource.getRepository(User), dataSource.getRepository(UserLog)]

  await user.deleteAll()
  await userLogs.deleteAll()
}

export async function addRawUser(dataSource: DataSource, user?: Partial<User>) {
  const repo = dataSource.getRepository(User)
  return repo.save({
    id: user?.id ?? 1,
    email: user?.email ?? 'email@email.com',
    name: user?.name ?? 'name',
    role: user?.role ?? Role.USER,
    password: user?.password ?? '123',
    ...user
  })
}
