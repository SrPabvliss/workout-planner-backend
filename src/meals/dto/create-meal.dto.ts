import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsArray,
  IsNumber,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { CreateMealIngredientDto } from './create-meal-ingredient.dto'

export class CreateMealDto {
  @ApiProperty({ description: 'Name of the meal' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Description of the meal' })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({ description: 'Preparation instructions' })
  @IsString()
  @IsNotEmpty()
  preparation: string

  @ApiProperty({ type: [CreateMealIngredientDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMealIngredientDto)
  ingredients: CreateMealIngredientDto[]

  @ApiProperty({ description: 'Category IDs', type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  categories: number[]
}
