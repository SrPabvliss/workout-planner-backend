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

  @Column()
  sets: number

  @Column()
  reps: number

  @Column()
  order: number

  @ManyToOne(() => PresetDay, (presetDay) => presetDay.exercises)
  @JoinColumn({
    name: 'day_id',
  })
  day: PresetDay

  @ManyToOne(() => Exercise)
  @JoinColumn({
    name: 'exercise_id',
  })
  exercise: Exercise
}
