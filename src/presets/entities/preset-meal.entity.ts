import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { PresetDay } from './preset-day.entity'
import { Meal } from 'src/meals/entities/meal.entity'

@Entity('preset_meal')
export class PresetMeal {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => PresetDay, (presetDay) => presetDay.id)
  @JoinColumn({
    name: 'day_id',
  })
  day: PresetDay

  @ManyToOne(() => Meal, (meal) => meal.id)
  @JoinColumn({
    name: 'meal_id',
  })
  meal: Meal
}
