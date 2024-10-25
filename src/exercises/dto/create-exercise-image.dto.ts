import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator'

export class CreateExerciseImageDto {
  @ApiProperty({
    description: 'URL de la imagen del ejercicio',
    example: 'https://ejemplo.com/imagen.jpg'
  })
  @IsString()
  @IsNotEmpty()
  url: string

  @ApiProperty({
    description: 'ID público de la imagen en el servicio de almacenamiento',
    example: 'exercise_123456'
  })
  @IsString()
  @IsNotEmpty()
  public_id: string

  @ApiProperty({
    description: 'Indica si es la imagen principal',
    default: false
  })
  @IsBoolean()
  @IsOptional()
  is_main?: boolean
}