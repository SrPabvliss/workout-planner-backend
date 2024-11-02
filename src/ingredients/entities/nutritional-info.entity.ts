import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { Ingredient } from './ingredient.entity'

@Entity('nutritional_info')
export class NutritionalInfo {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => Ingredient, (ingredient) => ingredient.nutritional_info, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  ingredient: Ingredient

  @Column('decimal', { precision: 10, scale: 2 })
  calories: number

  @Column('decimal', { precision: 10, scale: 2 })
  protein: number

  @Column('decimal', { precision: 10, scale: 2 })
  carbs: number

  @Column('decimal', { precision: 10, scale: 2 })
  fat: number

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  fiber: number

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  sugar: number

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  sodium: number

  @Column('decimal', { precision: 10, scale: 2 })
  serving_size: number

  @Column()
  serving_unit: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
