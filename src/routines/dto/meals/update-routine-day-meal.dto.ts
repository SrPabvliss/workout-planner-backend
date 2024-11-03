import { PartialType } from '@nestjs/swagger'
import { CreateRoutineDayMealDto } from './create-routine-day-meal.dto'

export class UpdateRoutineDayMealDto extends PartialType(
  CreateRoutineDayMealDto,
) {}
