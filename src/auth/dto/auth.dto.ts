import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class AuthDto {

  @ApiProperty({
    description: 'Username',
    type: String,
    example: 'user',
    required: true
  })
  @IsString()
  username: string

  @ApiProperty({
    description: 'Password',
    type: String,
    example: 'password',
    required: true
  })
  @IsString()
  password: string
}
