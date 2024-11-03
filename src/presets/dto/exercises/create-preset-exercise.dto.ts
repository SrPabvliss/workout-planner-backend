import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { CreatePresetDayDto } from './create-preset-day.dto'
import { Type } from 'class-transformer'

export class CreatePresetExerciseDto {
  @ApiProperty({
    description: 'Nombre del preset de ejercicios',
    type: String,
    required: true,
    example: 'Rutina Push Pull Legs',
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    description: 'Descripción del preset de ejercicios',
    type: String,
    required: true,
    example: 'Rutina de 3 días enfocada en diferentes grupos musculares',
  })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({
    description: 'Lista de días con sus ejercicios',
    type: [CreatePresetDayDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePresetDayDto)
  days: CreatePresetDayDto[]
}
