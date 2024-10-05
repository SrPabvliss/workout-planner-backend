import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";
import { CreateUserDto } from "src/users/dto/create-user.dto";

export class CreateStudentDto extends CreateUserDto {

  @ApiProperty({
    description: 'The trainer of the student',
    type: Number,
    required: true,
    example: 1,
  })
  @IsNumber()
  trainer: number

  @ApiProperty({
    description: 'The height of the student',
    type: Number,
    required: true,
    example: 1.75,
  })
  @IsNumber()
  height: number

  @ApiProperty({
    description: 'The weight of the student',
    type: Number,
    required: true,
    example: 70,
  })
  @IsNumber()
  weight: number

  @ApiProperty({
    description: 'Whether the student has trained before',
    type: Boolean,
    required: true,
    example: true,
  })
  @IsBoolean()
  trained_before: boolean

  @ApiProperty({
    description: 'The medical conditions of the student',
    type: String,
    required: true,
    example: 'Diabetes',
  })
  @IsString()
  medical_conditions: string
}
