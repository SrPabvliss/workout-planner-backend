import { IsNumber, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateNutritionalInfoDto {
  @ApiProperty({ description: 'Calories per serving' })
  @IsNumber()
  @IsNotEmpty()
  calories: number

  @ApiProperty({ description: 'Protein content per serving' })
  @IsNumber()
  @IsNotEmpty()
  protein: number

  @ApiProperty({ description: 'Carbohydrates content per serving' })
  @IsNumber()
  @IsNotEmpty()
  carbs: number

  @ApiProperty({ description: 'Fat content per serving' })
  @IsNumber()
  @IsNotEmpty()
  fat: number

  @ApiPropertyOptional({ description: 'Fiber content per serving' })
  @IsNumber()
  @IsOptional()
  fiber?: number

  @ApiPropertyOptional({ description: 'Sugar content per serving' })
  @IsNumber()
  @IsOptional()
  sugar?: number

  @ApiPropertyOptional({ description: 'Sodium content per serving' })
  @IsNumber()
  @IsOptional()
  sodium?: number

  @ApiProperty({ description: 'Size of one serving' })
  @IsNumber()
  @IsNotEmpty()
  serving_size: number

  @ApiProperty({ description: 'Unit of measurement for serving' })
  @IsString()
  @IsNotEmpty()
  serving_unit: string
}
