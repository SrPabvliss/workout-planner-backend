import { ApiProperty } from '@nestjs/swagger'
import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator'
import { CreateExerciseImageDto } from './create-exercise-image.dto'
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
  @IsArray()
  @IsNumber({}, { each: true })
  categories: number[]

  @ApiProperty({
    description: 'Imágenes del ejercicio',
    type: [CreateExerciseImageDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExerciseImageDto)
  images: CreateExerciseImageDto[]
}
