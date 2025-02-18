import { AuthService } from './services/auth.service';
import { Body, Controller, HttpException, Post } from '@nestjs/common';

import { GoogleLoginDto } from './dto/google-login-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google-login')
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
    const { token } = googleLoginDto;

    try {
      const googleVerification = await this.authService.googleLogin(token);

      return true;
    } catch (error) {
      console.log('Error is here', error);
      throw new HttpException(error.message, 401);
    }
  }
}
