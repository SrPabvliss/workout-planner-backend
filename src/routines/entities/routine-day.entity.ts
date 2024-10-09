import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { Routine } from './routine.entity'
import { RoutineExercise } from './routine-excercise.entity'
import { RoutineMeal } from './routine-meal.entity'

@Entity('routine_day')
export class RoutineDay {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  day_of_week: number

  @ManyToOne(() => Routine, (routine) => routine.id)
  @JoinColumn({
    name: 'routine_id',
  })
  routine_id: number

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date

  @Column({
    type: 'timestamp',
  })
  updated_at: Date

  @OneToMany(() => RoutineExercise, (routineExcercise) => routineExcercise.id)
  exercises: RoutineExercise[]

  @OneToMany(() => RoutineMeal, (routineMeal) => routineMeal.id)
  meals: RoutineMeal[]
}
