import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Student } from '../../students/entities/student.entity'
import { Routine } from '../../routines/entities/routine.entity'

@Entity()
export class Trainer {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => User, (user) => user.trainer)
  @JoinColumn({
    name: 'user_id',
  })
  user: User

  @Column()
  specialization: string

  @Column()
  years_of_experience: number

  @OneToMany(() => Student, (student) => student.trainer)
  students: Student[]

  @OneToMany(() => Routine, (routine) => routine.trainer)
  routines: Routine[]
}
