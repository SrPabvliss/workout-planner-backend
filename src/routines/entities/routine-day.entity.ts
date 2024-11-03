import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
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

  @Column({ type: 'date' })
  date: Date

  @ManyToOne(() => Routine, (routine) => routine.days)
  @JoinColumn({ name: 'routine_id' })
  routine: Routine

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updated_at: Date

  @OneToMany(() => RoutineExercise, (routineExercise) => routineExercise.day)
  exercises: RoutineExercise[]

  @OneToMany(() => RoutineMeal, (routineMeal) => routineMeal.day)
  meals: RoutineMeal[]
}
