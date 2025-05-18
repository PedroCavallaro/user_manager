import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { CreateUserDTO } from 'src/modules/auth'
import { Like, Repository, UpdateResult } from 'typeorm'
import { User } from '../../../entities'
import { Role } from '../../../enums'
import { GetInactiveUsersListQueryDTO, GetUsersListQueryDTO } from '../../../http'
import { UserRepository } from './user.respository'

describe('UserRepository', () => {
  let repository: UserRepository
  let userRepo: Repository<User>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            count: jest.fn(),
            find: jest.fn(),
            softDelete: jest.fn()
          }
        }
      ]
    }).compile()

    repository = module.get<UserRepository>(UserRepository)
    userRepo = module.get(getRepositoryToken(User))
  })

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const dto: CreateUserDTO = {
        name: 'Test',
        email: 'test@example.com',
        password: 'hashed'
      }

      const expected = { id: 1, ...dto, role: Role.USER } as User

      jest.spyOn(userRepo, 'save').mockResolvedValue(expected)

      const result = await repository.createUser(dto)

      expect(userRepo.save).toHaveBeenCalledWith({
        name: dto.name,
        email: dto.email,
        role: Role.USER,
        password: dto.password
      })
      expect(result).toEqual(expected)
    })
  })

  describe('update', () => {
    it('should update and return the user', async () => {
      const userId = 1
      const dto = { name: 'Updated' }
      const expected = { id: userId, ...dto } as User

      jest.spyOn(userRepo, 'save').mockResolvedValue(expected)

      const result = await repository.update(userId, dto)

      expect(userRepo.save).toHaveBeenCalledWith({ id: userId, ...dto })
      expect(result).toEqual(expected)
    })
  })

  describe('findUserBy', () => {
    it('should find one user by condition', async () => {
      const where = { email: 'test@example.com' }
      const user = { id: 1, email: 'test@example.com' } as User

      jest.spyOn(userRepo, 'findOne').mockResolvedValue(user)

      const result = await repository.findUserBy(where)

      expect(userRepo.findOne).toHaveBeenCalledWith({ where })
      expect(result).toEqual(user)
    })
  })

  describe('findManyUsersBy', () => {
    it('should find many users by condition', async () => {
      const where = { role: Role.USER }
      const users = [{ id: 1 }, { id: 2 }] as User[]

      jest.spyOn(userRepo, 'find').mockResolvedValue(users)

      const result = await repository.findManyUsersBy(where)

      expect(userRepo.find).toHaveBeenCalledWith({ where })
      expect(result).toEqual(users)
    })
  })

  describe('findPaginated', () => {
    it('should return a paginated list of users', async () => {
      const query: GetUsersListQueryDTO = {
        query: 'john@example.com',
        sortBy: 'name',
        getSkipAndTake: () => ({
          skip: 0,
          take: 10
        })
      } as GetUsersListQueryDTO

      const users = [{ id: 1 }, { id: 2 }] as User[]

      jest.spyOn(userRepo, 'count').mockResolvedValue(2)
      jest.spyOn(userRepo, 'find').mockResolvedValue(users)

      const result = await repository.findPaginated(query)

      expect(userRepo.find).toHaveBeenCalledWith({
        where: {
          email: Like('%john@example.com%'),
          role: undefined
        },
        order: { [query.sortBy!]: query.order },
        skip: 0,
        take: 10
      })
      expect(result).toEqual([users, 2])
    })
  })

  describe('findInactiveUsersPaginated', () => {
    it('should return users inactive for a given period', async () => {
      const query: GetInactiveUsersListQueryDTO = {
        query: 'user@example.com',
        sortBy: 'id',
        order: 'desc',
        days: 30,
        limit: 10,
        page: 1,
        getSkipAndTake: jest.fn().mockReturnValue({ skip: 0, take: 5 })
      }

      const users = [{ id: 1 }, { id: 2 }] as User[]

      jest.spyOn(userRepo, 'find').mockResolvedValue(users)

      const result = await repository.findInactiveUsersPaginated(query)

      expect(userRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            email: query.query,
            loggedAt: expect.any(Object)
          }),
          skip: 0,
          take: 5
        })
      )

      expect(result).toEqual(users)
    })
  })

  describe('delete', () => {
    it('should soft delete a user by ID', async () => {
      const userId = 1
      const deleted = { affected: 1 } as UpdateResult

      jest.spyOn(userRepo, 'softDelete').mockResolvedValue(deleted)

      const result = await repository.delete(userId)

      expect(userRepo.softDelete).toHaveBeenCalledWith({ id: userId })
      expect(result).toEqual(deleted)
    })
  })
})
