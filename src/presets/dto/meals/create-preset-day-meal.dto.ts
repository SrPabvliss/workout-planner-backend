import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'

export class CreatePresetDayMealDto {
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
    minimum: 1,
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  order: number
}
