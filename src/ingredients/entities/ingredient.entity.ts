import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm'
import { NutritionalInfo } from './nutritional-info.entity'
import { MealIngredient } from 'src/meals/entities/meal-ingredient.entity'

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  normalized_name: string

  @Column({ default: true })
  is_active: boolean

  @OneToMany(() => MealIngredient, (mi) => mi.ingredient)
  mealIngredients: MealIngredient[]

  @OneToOne(() => NutritionalInfo, (ni) => ni.ingredient, { eager: true })
  nutritionalInfo: NutritionalInfo

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
