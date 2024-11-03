import { PartialType } from '@nestjs/swagger'
import { CreateRoutineDayExerciseDto } from './create-routine-day-exercise.dto'

export class UpdateRoutineDayExerciseDto extends PartialType(
  CreateRoutineDayExerciseDto,
) {}
