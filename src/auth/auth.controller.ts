import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { GoogleAuthService } from './services/google.service';
import { GoogleLoginDto } from './dto/google-login-dto';

@Controller('auth')
export class AuthController {
  constructor(private googleService: GoogleAuthService) {}

  @Post('google-login')
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
    const { token } = googleLoginDto;
    console.log('Token is here', token);
    try {
      const googleVerification =
        await this.googleService.verifyGoogleToken(token);
      console.log('Google Verification is here', googleVerification);
      return 'verification';
    } catch (error) {
      console.log('Error is here', error);
      throw new HttpException(error.message, 401);
    }
  }
}
