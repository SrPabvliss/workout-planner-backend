import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { RoutineDay } from './routine-day.entity'
import { Student } from 'src/students/entities/student.entity'
import { Trainer } from 'src/trainers/entities/trainer.entity'

@Entity('routine')
export class Routine {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({
    name: 'created_by',
  })
  created_by: User

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date

  @OneToMany(() => RoutineDay, (routineDay) => routineDay.id)
  days: RoutineDay[]

  @ManyToOne(() => Student, (student) => student.id)
  @JoinColumn({
    name: 'student_id',
  })
  student: Student

  @ManyToOne(() => Trainer, (trainer) => trainer.id)
  @JoinColumn({
    name: 'trainer_id',
  })
  trainer: Trainer
}
