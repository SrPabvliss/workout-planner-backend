import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm'
import { Exercise } from './exercise.entity'

@Entity('exercise_images')
export class ExerciseImage {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Exercise, (exercise) => exercise.images, {
    onDelete: 'CASCADE',
  })
  exercise: Exercise

  @Column()
  url: string

  @Column()
  public_id: string

  @Column({ default: false })
  is_main: boolean

  @CreateDateColumn()
  created_at: Date
}
