import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsString } from 'class-validator'

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
    description: 'The email of the user',
    type: String,
    required: true,
    example: 'johndoe@gmail.com',
  })
  @IsEmail()
  email: string
}
