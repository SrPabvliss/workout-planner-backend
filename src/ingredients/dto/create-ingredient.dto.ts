import { IsString, IsNotEmpty, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { CreateNutritionalInfoDto } from './create-nutritional-info.dto'

export class CreateIngredientDto {
  @ApiProperty({ description: 'Name of the ingredient' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Nutritional information' })
  @ValidateNested()
  @Type(() => CreateNutritionalInfoDto)
  nutritionalInfo: CreateNutritionalInfoDto
}
