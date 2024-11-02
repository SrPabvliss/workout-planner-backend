import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Meal } from './meal.entity'
import { Ingredient } from '../../ingredients/entities/ingredient.entity'
import { Unit } from './units.entity'

@Entity('meal_ingredients')
export class MealIngredient {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Meal, (meal) => meal.meal_ingredients, {
    onDelete: 'CASCADE',
  })
  meal: Meal

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.meal_ingredients, {
    eager: true,
  })
  ingredient: Ingredient

  @ManyToOne(() => Unit, (unit) => unit.meal_ingredients, {
    eager: true,
  })
  unit: Unit

  @Column('decimal', { precision: 10, scale: 2 })
  quantity: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
