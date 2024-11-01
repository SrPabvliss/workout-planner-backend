import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { MealIngredient } from './meal-ingredient.entity'

export enum UnitType {
  MASS = 'MASS',
  VOLUME = 'VOLUME',
  UNIT = 'UNIT',
}

@Entity('units')
export class Unit {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  symbol: string

  @Column({
    type: 'enum',
    enum: UnitType,
  })
  type: UnitType

  @Column({ default: true })
  is_active: boolean

  @OneToMany(() => MealIngredient, (mi) => mi.unit)
  mealIngredients: MealIngredient[]
}
