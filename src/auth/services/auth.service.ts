import { JwtPayload } from './../../../node_modules/@types/jsonwebtoken/index.d';
import { SupabaseService } from 'src/supabase/supabase.service';
import { Injectable } from '@nestjs/common';
import { GoogleAuthService } from './google.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly supabaseService: SupabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async googleLogin(token: string): Promise<any> {
    // Verify google token may fail
    try {
      const googlePayload =
        await this.googleAuthService.verifyGoogleToken(token);
      const user: User = await this.supabaseService.getUserByEmail(
        googlePayload.email,
      );

      // If user does not exist
      if (!user) {
      }
      // Create JWT token
      const JwtPayload = { userId: user.id, email: user.email };
      const jwtToken = await this.jwtService.signAsync(JwtPayload);

      return { accessToken: jwtToken, userEmail: user.email };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
