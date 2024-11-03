import { PartialType } from '@nestjs/swagger'
import { CreatePresetDayMealDto } from './create-preset-day-meal.dto'

export class UpdatePresetDayMealDto extends PartialType(
  CreatePresetDayMealDto,
) {}
