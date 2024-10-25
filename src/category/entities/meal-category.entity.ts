import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Category } from './category.entity'
import { Meal } from '../../meals/entities/meal.entity'

@Entity('meal_categories')
export class MealCategory {
  @PrimaryColumn()
  meal_id: number

  @PrimaryColumn()
  category_id: number

  @ManyToOne(() => Meal, (meal) => meal.mealCategories)
  @JoinColumn({ name: 'meal_id' })
  meal: Meal

  @ManyToOne(() => Category, (category) => category.mealCategories)
  @JoinColumn({ name: 'category_id' })
  category: Category
}
