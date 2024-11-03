import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Preset } from './preset.entity'
import { PresetExercise } from './preset-excercise.entity'
import { PresetMeal } from './preset-meal.entity'

@Entity('preset_day')
export class PresetDay {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  day_of_week: number

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date

  @ManyToOne(() => Preset, (preset) => preset.days)
  @JoinColumn({
    name: 'preset_id',
  })
  preset: Preset

  @OneToMany(() => PresetExercise, (presetExercise) => presetExercise.day)
  exercises: PresetExercise[]

  @OneToMany(() => PresetMeal, (presetMeal) => presetMeal.day)
  meals: PresetMeal[]
}
