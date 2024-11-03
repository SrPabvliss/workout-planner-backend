import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { Preset } from './preset.entity'
import { PresetExercise } from './preset-excercise.entity'

@Entity('preset_day')
export class PresetDay {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  day_of_week: number

  @ManyToOne(() => Preset, (preset) => preset.id)
  @JoinColumn({
    name: 'preset_id',
  })
  preset: Preset

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date

  @Column({
    type: 'timestamp',
  })
  updated_at: Date

  @OneToMany(() => PresetExercise, (presetExercise) => presetExercise.id)
  exercises: PresetExercise[]
}
