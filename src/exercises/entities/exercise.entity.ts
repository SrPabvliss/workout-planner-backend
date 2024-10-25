import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Category } from '../../category/entities/category.entity'
import { ExerciseImage } from './exercises-images.entity'
import { ExerciseCategory } from 'src/category/entities/exercise-category.entity'

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  normalized_name: string

  @Column('text')
  description: string

  @Column({ nullable: true })
  youtube_url: string

  @ManyToOne(() => User)
  created_by: User

  @OneToMany(() => ExerciseImage, (image) => image.exercise)
  images: ExerciseImage[]

  @OneToMany(() => ExerciseCategory, (ec) => ec.exercise)
  exerciseCategories: ExerciseCategory[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
