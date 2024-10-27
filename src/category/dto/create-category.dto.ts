import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator'
import { CategoryType } from '../enums/category-type.enum'
import { ApiProperty } from '@nestjs/swagger'

export class CreateCategoryDto {
  @ApiProperty({
    description: 'El nombre de la categoría',
    type: String,
    required: true,
    example: 'Cardio',
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    description: 'La descripción de la categoría',
    type: String,
    required: false,
    example:
      'Ejercicios de Cardio, ayudan a mejorar la circulación y la resistencia.',
  })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({
    description: 'El tipo de la categoría',
    enum: CategoryType,
    required: true,
    example: CategoryType.EXERCISE,
    enumName: 'CategoryType',
  })
  @IsNotEmpty()
  @IsEnum(CategoryType)
  type: CategoryType

  @ApiProperty({
    description: 'El color de la categoría',
    type: String,
    required: false,
    example: '#FF0000',
  })
  @IsOptional()
  @IsString()
  color?: string
}
