import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Meal {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  description: string

  @Column()
  nutritional_info: string

  @Column()
  ingredients: string

  @Column()
  preparation: string

  @Column()
  created_by: number

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  created_at: Date

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date
}
