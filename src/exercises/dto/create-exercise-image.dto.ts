import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsOptional } from 'class-validator'

export class CreateExerciseImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Archivo de imagen',
  })
  file: Express.Multer.File

  @ApiProperty({
    description: 'Indica si es la imagen principal',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  is_main?: boolean
}
