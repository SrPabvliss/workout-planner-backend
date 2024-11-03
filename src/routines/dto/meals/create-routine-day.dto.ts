import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsDate,
  Max,
  Min,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { CreateRoutineDayMealDto } from './create-routine-day-meal.dto'

export class CreateRoutineDayDto {
  @ApiProperty({
    description: 'Día de la semana (1-7)',
    type: Number,
    required: true,
    minimum: 1,
    maximum: 7,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(7)
  day_of_week: number

  @ApiProperty({
    description: 'Fecha específica para este día de rutina',
    type: Date,
    required: true,
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date

  @ApiProperty({
    description: 'Lista de comidas para este día',
    type: [CreateRoutineDayMealDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoutineDayMealDto)
  meals: CreateRoutineDayMealDto[]
}
