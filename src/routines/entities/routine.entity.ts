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
import { Student } from '../../students/entities/student.entity'
import { Trainer } from '../../trainers/entities/trainer.entity'
import { RoutineStatus, RoutineTypes } from '../enums/routine.enum'

@Entity('routine')
export class Routine {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @Column({
    type: 'enum',
    enum: RoutineTypes,
    default: RoutineTypes.EXERCISE,
  })
  type: RoutineTypes

  @Column({
    type: 'enum',
    enum: RoutineStatus,
    default: RoutineStatus.DRAFT,
  })
  status: RoutineStatus

  @Column({ type: 'date' })
  start_date: Date

  @Column({ type: 'date' })
  end_date: Date

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => RoutineDay, (routineDay) => routineDay.routine)
  days: RoutineDay[]

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student

  @ManyToOne(() => Trainer)
  @JoinColumn({ name: 'trainer_id' })
  trainer: Trainer
}
