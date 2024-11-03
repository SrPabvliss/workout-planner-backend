import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Exercise } from '../../exercises/entities/exercise.entity'
import { RoutineDay } from './routine-day.entity'

@Entity('routine_exercise')
export class RoutineExercise {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => RoutineDay, (routineDay) => routineDay.exercises)
  @JoinColumn({ name: 'day_id' })
  day: RoutineDay

  @Column()
  sets: number

  @Column()
  reps: number

  @Column({ default: 0 })
  order: number

  @Column({ default: false })
  completed: boolean

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @ManyToOne(() => Exercise)
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise
}
