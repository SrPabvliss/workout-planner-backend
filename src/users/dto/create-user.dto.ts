import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsString } from 'class-validator'
import { Unique } from 'typeorm'

export class CreateUserDto {
  @ApiProperty({
    description: 'The first name of the user',
    type: String,
    required: true,
    example: 'John',
  })
  @IsString()
  first_name: string

  @ApiProperty({
    description: 'The last name of the user',
    type: String,
    required: true,
    example: 'Doe',
  })
  @IsString()
  last_name: string

  @ApiProperty({
    description: 'The username of the user',
    type: String,
    required: true,
    example: 'johndoe',
  })
  @IsString()
  username: string

  @ApiProperty({
    description: 'The password of the user',
    type: String,
    required: true,
    example: 'password123',
  })
  @IsString()
  password: string

  @ApiProperty({
    description: 'The email of the user',
    type: String,
    required: true,
    example: 'johndoe@gmail.com',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'The role of the user',
    type: String,
    required: true,
    example: 'trainer',
  })
  @IsEnum(['trainer', 'student'])
  role: 'trainer' | 'student'
}
