import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  Unique,
} from 'typeorm'
import { Trainer } from '../../trainers/entities/trainer.entity'
import { Student } from '../../students/entities/student.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  first_name: string

  @Column()
  last_name: string

  @Column()
  username: string

  @Column()
  password: string

  @Column({
    unique: true,
  })
  email: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date

  @Column()
  avatar_url: string

  @OneToOne(() => Trainer, (trainer) => trainer.user)
  trainer: Trainer

  @OneToOne(() => Student, (student) => student.user)
  student: Student
}

