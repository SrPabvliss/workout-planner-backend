import { ApiProperty } from '@nestjs/swagger'
import {
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  Min,
  IsOptional,
} from 'class-validator'

export class CreateRoutineDayMealDto {
  @ApiProperty({
    description: 'ID de la comida a asignar',
    type: Number,
    required: true,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  meal_id: number

  @ApiProperty({
    description: 'Orden de la comida en el día',
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
    description: 'Indica si la comida fue consumida',
    type: Boolean,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  consumed?: boolean
}
