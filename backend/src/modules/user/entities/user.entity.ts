import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import { Role } from '../enums'
import { UserLog } from './user-log.entity'

@Entity()
export class User {
  //aqui seria interessante ter dois ids, um interno do banco como number, e outro como uuid para enviar para o front
  // operações como skip e take tendem a consumir muito mais processamento quando o pk é um uuid, por ele não ser sequencial
  // o pubId vai ser utilizado pelo front para as requisições, por ser um uuid fica muito complicado manipular as requests para atacar o sistema
  // ver mais em:
  // https://planetscale.com/blog/the-problem-with-using-a-uuid-primary-key-in-mysql
  // https://leapcell.medium.com/the-dark-side-of-using-uuid-as-a-primary-key-in-mysql-e6a05e2ef022
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  name: string

  @Column({ nullable: false, unique: true })
  email: string

  @Column({ nullable: true, name: 'profile_image' })
  profileImage?: string

  @Column({ nullable: true })
  password: string

  @Column({ type: 'enum', enum: Role, nullable: false })
  role: Role

  @Column({ nullable: true, name: 'logged_at' })
  loggedAt?: Date

  @Column({ nullable: true, name: 'last_ip_used' })
  lastIpUsed?: string

  @OneToMany(
    () => UserLog,
    (userLog) => userLog.userId
  )
  userChanges: UserLog[]

  @OneToMany(
    () => UserLog,
    (userLog) => userLog.requestorId
  )
  changesOnUsers: UserLog[]

  @DeleteDateColumn({ nullable: true, name: 'deleted_at' })
  deletedAt?: Date

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date

  isAdmin() {
    return this.role === Role.ADMIN
  }

  isActive() {
    if (!this.loggedAt) return false

    const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000

    const now = new Date()
    const diff = now.getTime() - this.loggedAt.getTime()

    return diff < THIRTY_DAYS_IN_MS
  }
}
