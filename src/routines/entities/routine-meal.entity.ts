import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm'
import { Meal } from '../../meals/entities/meal.entity'
import { RoutineDay } from './routine-day.entity'

@Entity('routine_meal')
export class RoutineMeal {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => RoutineDay, (routineDay) => routineDay.meals)
  @JoinColumn({ name: 'day_id' })
  day: RoutineDay

  @Column({ default: 0 })
  order: number

  @Column({ default: false })
  consumed: boolean

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @ManyToOne(() => Meal)
  @JoinColumn({ name: 'meal_id' })
  meal: Meal
}
