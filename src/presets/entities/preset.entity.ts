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
import { PresetDay } from './preset-day.entity'
import { User } from '../../users/entities/user.entity'
import { PresetType } from '../enums/preset-type.enum'

@Entity('preset')
export class Preset {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date

  @ManyToOne(() => User)
  @JoinColumn({
    name: 'created_by',
  })
  created_by: User

  @OneToMany(() => PresetDay, (presetDay) => presetDay.preset)
  days: PresetDay[]

  @Column({
    type: 'enum',
    enum: PresetType,
    default: PresetType.MEAL,
  })
  type: PresetType
}
