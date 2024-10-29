import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm'
import { Exercise } from '../../exercises/entities/exercise.entity'
import { Meal } from '../../meals/entities/meal.entity'
import { CategoryType } from '../enums/category-type.enum'
import { ExerciseCategory } from './exercise-category.entity'
import { MealCategory } from './meal-category.entity'

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({
    nullable: true,
  })
  normalizaed_name: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column({
    type: 'enum',
    enum: CategoryType,
  })
  type: CategoryType

  @Column({ type: 'text', nullable: true })
  color?: string

  @OneToMany(() => ExerciseCategory, (ec) => ec.category)
  exerciseCategories: ExerciseCategory[]

  @OneToMany(() => MealCategory, (mc) => mc.category)
  mealCategories: MealCategory[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
