import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm'
import { PresetDay } from './preset-day.entity'
import { Exercise } from '../../exercises/entities/exercise.entity'

@Entity('preset_exercise')
export class PresetExercise {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => PresetDay, (presetDay) => presetDay.id)
  @JoinColumn({
    name: 'day_id',
  })
  day: PresetDay

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
