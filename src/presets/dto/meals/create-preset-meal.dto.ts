import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator'
import { CreatePresetDayDto } from './create-preset-day.dto'
import { Type } from 'class-transformer'

export class CreatePresetMealDto {
  @ApiProperty({
    description: 'Nombre del preset de comidas',
    type: String,
    required: true,
    example: 'Plan Proteico Alto en Carbohidratos',
  })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty({
    description: 'Descripción del preset de comidas',
    type: String,
    required: true,
    example:
      'Plan alimenticio enfocado en ganancia muscular con 5 comidas diarias',
  })
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty({
    description: 'Lista de días con sus comidas',
    type: [CreatePresetDayDto],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePresetDayDto)
  days: CreatePresetDayDto[]
}
