import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Trainer } from '../../trainers/entities/trainer.entity'
import { Routine } from '../../routines/entities/routine.entity'

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => User, (user) => user.student)
  @JoinColumn({
    name: 'user_id',
  })
  user: User

  @ManyToOne(() => Trainer, (trainer) => trainer.students)
  trainer: Trainer

  @Column('float')
  height: number

  @Column('float')
  weight: number

  @Column()
  trained_before: boolean

  @Column({
    type: 'text',
    nullable: true,
  })
  medical_conditions?: string

  @OneToMany(() => Routine, (routine) => routine.id)
  routines: Routine[]
}
