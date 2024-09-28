import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm'
import { Trainer } from '../../trainers/entities/trainer.entity'
import { Student } from '../../students/entities/student.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  password: string

  @Column()
  email: string

  @Column()
  role: 'trainer' | 'student'

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date

  @OneToOne(() => Trainer, (trainer) => trainer.user)
  trainer: Trainer

  @OneToOne(() => Student, (student) => student.user)
  student: Student
}
