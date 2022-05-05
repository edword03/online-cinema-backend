import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    return this.AuthService.login(dto);
  }

  @HttpCode(200)
  @Post('login/access-token')
  async getNewToken(@Body() dto: RefreshTokenDto) {
    return this.AuthService.getNewToken(dto);
  }

  @HttpCode(200)
  @Post('register')
  async register(@Body() dto: AuthDto) {
    return this.AuthService.register(dto);
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Body() dto: RefreshTokenDto) {
    return this.AuthService.logout(dto);
  }
}
