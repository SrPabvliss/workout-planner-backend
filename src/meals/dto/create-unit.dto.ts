import { IsString, IsNotEmpty, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { UnitType } from '../entities/units.entity'

export class CreateUnitDto {
  @ApiProperty({ description: 'Name of the unit' })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ description: 'Symbol of the unit' })
  @IsString()
  @IsNotEmpty()
  symbol: string

  @ApiProperty({ enum: UnitType, description: 'Type of unit' })
  @IsEnum(UnitType)
  @IsNotEmpty()
  type: UnitType
}