import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
  ValidateNested,
} from 'class-validator'
import { CreatePresetDayExerciseDto } from './create-preset-day-exercise.dto'
import { Type } from 'class-transformer'

export class CreatePresetDayDto {
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
    description: 'Lista de ejercicios para este día',
    type: [CreatePresetDayExerciseDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePresetDayExerciseDto)
  exercises: CreatePresetDayExerciseDto[]
}
