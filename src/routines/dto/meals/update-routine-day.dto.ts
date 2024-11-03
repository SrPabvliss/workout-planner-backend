import { PartialType } from '@nestjs/swagger'
import { CreateRoutineDayDto } from './create-routine-day.dto'

export class UpdateRoutineDayDto extends PartialType(CreateRoutineDayDto) {}
