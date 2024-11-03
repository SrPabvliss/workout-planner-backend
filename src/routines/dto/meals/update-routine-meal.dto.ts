import { PartialType } from '@nestjs/swagger'
import { CreateRoutineMealDto } from './create-routine-meal.dto'

export class UpdateRoutineMealDto extends PartialType(CreateRoutineMealDto) {}
