import { PartialType } from '@nestjs/swagger'
import { CreatePresetExerciseDto } from './create-preset-exercise.dto'

export class UpdatePresetExerciseDto extends PartialType(
  CreatePresetExerciseDto,
) {}
