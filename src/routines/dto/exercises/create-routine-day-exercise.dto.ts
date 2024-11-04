import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  Min,
  IsBoolean,
  IsOptional,
} from 'class-validator'

export class CreateRoutineDayExerciseDto {
  @ApiProperty({
    description: 'ID del ejercicio a asignar',
    type: Number,
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  exercise_id: number

  @ApiProperty({
    description: 'Número de series del ejercicio',
    type: Number,
    required: true,
    minimum: 1,
    example: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  sets: number

  @ApiProperty({
    description: 'Número de repeticiones por serie',
    type: Number,
    required: true,
    minimum: 1,
    example: 12,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  reps: number

  @ApiProperty({
    description: 'Orden del ejercicio en el día',
    type: Number,
    required: true,
    minimum: 0,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  order: number

  @ApiProperty({
    description: 'Indica si el ejercicio fue completado',
    type: Boolean,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  completed?: boolean
}
