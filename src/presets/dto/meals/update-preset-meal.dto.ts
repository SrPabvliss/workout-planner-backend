import { PartialType } from '@nestjs/swagger'
import { CreatePresetMealDto } from './create-preset-meal.dto'

export class UpdatePresetMealDto extends PartialType(CreatePresetMealDto) {}
