import { AuthDto } from './auth.dto'
import { ApiProperty, PartialType } from '@nestjs/swagger'

export class UpdateAuthDto extends PartialType(AuthDto) {
  @ApiProperty({
    description: 'New password',
    type: String,
    example: 'password',
    required: true,
  })
  newPassword: string
}
