import { PartialType } from '@nestjs/swagger'
import { CreatePresetDayDto } from './create-preset-day.dto'

export class UpdatePresetDayDto extends PartialType(CreatePresetDayDto) {}
