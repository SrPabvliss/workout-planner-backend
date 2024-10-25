import { MealCategory } from 'src/category/entities/meal-category.entity'
import { Category } from '../../category/entities/category.entity'
import { User } from '../../users/entities/user.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'

@Entity('meals')
export class Meal {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column('text')
  description: string

  @Column('text')
  nutritional_info: string

  @Column('text')
  ingredients: string

  @Column('text')
  preparation: string

  @ManyToOne(() => User)
  created_by: User

  @OneToMany(() => MealCategory, (mc) => mc.meal)
  mealCategories: MealCategory[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
