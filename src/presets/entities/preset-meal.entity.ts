import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { PresetDay } from './preset-day.entity'
import { Meal } from '../../meals/entities/meal.entity'

@Entity('preset_meal')
export class PresetMeal {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  order: number

  @ManyToOne(() => PresetDay, (presetDay) => presetDay.meals)
  @JoinColumn({
    name: 'day_id',
  })
  day: PresetDay

  @ManyToOne(() => Meal)
  @JoinColumn({
    name: 'meal_id',
  })
  meal: Meal
}
