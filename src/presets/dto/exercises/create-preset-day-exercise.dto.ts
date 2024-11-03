import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'

export class CreatePresetDayExerciseDto {
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
}
