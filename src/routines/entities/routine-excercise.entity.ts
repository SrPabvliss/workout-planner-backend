import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm'
import { Exercise } from 'src/exercises/entities/exercise.entity'
import { RoutineDay } from './routine-day.entity'

@Entity('routine_exercise')
export class RoutineExercise {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => RoutineDay, (routineDay) => routineDay.id)
  @JoinColumn({
    name: 'day_id',
  })
  day: RoutineDay

  @Column()
  sets: number

  @Column()
  reps: number

  @ManyToOne(() => Exercise, (exercise) => exercise.id)
  @JoinColumn({
    name: 'exercise_id',
  })
  exercise: Exercise
}
