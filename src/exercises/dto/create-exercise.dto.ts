import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator'
import { Type } from 'class-transformer'

export class CreateExerciseDto {
  @ApiProperty({
    description: 'Nombre del ejercicio',
    example: 'Push-up',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'Descripción detallada del ejercicio',
    example: 'Ejercicio de empuje que trabaja principalmente el pecho',
  })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({
    description: 'URL de YouTube con el video demostrativo',
    example: 'https://youtube.com/watch?v=example',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  youtube_url?: string

  @ApiProperty({
    description: 'IDs de las categorías',
    type: [Number],
    example: [1, 2],
  })
  categories: number[]

  @ApiProperty({
    description: 'Índices de las imágenes principales',
    type: [Number],
    required: false,
  })
  @IsOptional()
  mainImageIndexes?: number[]

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  images?: Express.Multer.File[]
}
