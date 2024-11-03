import { PartialType } from '@nestjs/swagger'
import { CreatePresetDayExerciseDto } from './create-preset-day-exercise.dto'

export class UpdatePresetDayExerciseDto extends PartialType(
  CreatePresetDayExerciseDto,
) {}
