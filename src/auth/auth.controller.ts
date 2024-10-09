import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { UpdateAuthDto } from './dto/update-password.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() authDto: AuthDto) {
    return await this.authService.login(authDto)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return
  }

  @Post('change-password')
  async changePassword(@Body() updateAuthDto: UpdateAuthDto) {
    return await this.authService.changePassword(updateAuthDto)
  }
}
