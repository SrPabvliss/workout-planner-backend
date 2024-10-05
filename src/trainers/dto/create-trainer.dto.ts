import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'
import { CreateUserDto } from 'src/users/dto/create-user.dto'

export class CreateTrainerDto extends CreateUserDto {
  @ApiProperty({
    description: 'The specialization of the trainer',
    type: String,
    required: true,
    example: 'yoga',
  })
  @IsString()
  specialization: string

  @ApiProperty({
    description: 'The years of experience of the trainer',
    type: Number,
    required: true,
    example: 3,
  })
  @IsNumber()
  years_of_experience: number
}
