import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsDate,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'
import { CreateRoutineDayDto } from './create-routine-day.dto'
import { RoutineStatus } from 'src/routines/enums/routine.enum'

export class CreateRoutineExerciseDto {
  @ApiProperty({
    description: 'Nombre de la rutina',
    type: String,
    required: true,
    example: 'Rutina de Fuerza - Juan Pérez',
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    description: 'Descripción de la rutina',
    type: String,
    required: true,
    example: 'Rutina personalizada para aumentar fuerza',
  })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({
    description: 'Estado de la rutina',
    enum: RoutineStatus,
    default: RoutineStatus.DRAFT,
  })
  @IsEnum(RoutineStatus)
  status: RoutineStatus

  @ApiProperty({
    description: 'Fecha de inicio de la rutina',
    type: Date,
    required: true,
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  start_date: Date

  @ApiProperty({
    description: 'Fecha de fin de la rutina',
    type: Date,
    required: true,
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  end_date: Date

  @ApiProperty({
    description: 'Lista de días con sus ejercicios',
    type: [CreateRoutineDayDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoutineDayDto)
  days: CreateRoutineDayDto[]
}
