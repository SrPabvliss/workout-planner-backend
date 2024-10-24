import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Meal } from '../../meals/entities/meal.entity'
import { RoutineDay } from './routine-day.entity'

@Entity('routine_meal')
export class RoutineMeal {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => RoutineDay, (routineDay) => routineDay.id)
  @JoinColumn({
    name: 'day_id',
  })
  day: RoutineDay

  @ManyToOne(() => Meal, (meal) => meal.id)
  @JoinColumn({
    name: 'meal_id',
  })
  meal: Meal
}
