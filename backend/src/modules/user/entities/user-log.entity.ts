import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import { LogAction } from '../enums'
import { User } from './user.entity'

@Entity('user_log')
export class UserLog {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false, type: 'enum', enum: LogAction })
  action: LogAction

  @Column({ nullable: false, name: 'user_id' })
  userId: number

  @Column({ nullable: false, name: 'requestor_id' })
  requestorId: number

  @JoinColumn({ name: 'requestor_id' })
  @ManyToOne(
    () => User,
    (user) => user.userChanges
  )
  user: User

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(
    () => User,
    (user) => user.changesOnUsers
  )
  requestor: User

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date
}
