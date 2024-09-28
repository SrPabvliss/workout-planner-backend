import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { Trainer } from '../../trainers/entities/trainer.entity'

@Entity()
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column('text')
  description: string

  @Column()
  youtube_link: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column()
  created_by: number

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date
}
