import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Category } from './category.entity'
import { Exercise } from '../../exercises/entities/exercise.entity'

@Entity('exercise_categories')
export class ExerciseCategory {
  @PrimaryColumn()
  exercise_id: number

  @PrimaryColumn()
  category_id: number

  @ManyToOne(() => Exercise, (exercise) => exercise.exerciseCategories)
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise

  @ManyToOne(() => Category, (category) => category.exerciseCategories)
  @JoinColumn({ name: 'category_id' })
  category: Category
}
