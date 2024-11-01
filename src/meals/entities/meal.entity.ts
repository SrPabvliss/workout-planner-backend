import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { MealCategory } from '../../category/entities/meal-category.entity'
import { MealIngredient } from './meal-ingredient.entity'

@Entity('meals')
export class Meal {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column('text')
  description: string

  @Column('text')
  preparation: string

  @ManyToOne(() => User)
  created_by: User

  @OneToMany(() => MealIngredient, (mi) => mi.meal, {
    cascade: true,
  })
  mealIngredients: MealIngredient[]

  @OneToMany(() => MealCategory, (mc) => mc.meal)
  mealCategories: MealCategory[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
