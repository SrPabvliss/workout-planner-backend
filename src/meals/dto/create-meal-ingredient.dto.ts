import { IsNumber, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateMealIngredientDto {
  @ApiProperty({ description: 'ID of the ingredient' })
  @IsNumber()
  @IsNotEmpty()
  ingredient_id: number

  @ApiProperty({ description: 'ID of the unit of measurement' })
  @IsNumber()
  @IsNotEmpty()
  unit_id: number

  @ApiProperty({ description: 'Quantity of the ingredient' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number
}
