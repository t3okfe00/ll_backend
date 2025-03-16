import { ConfigService } from '@nestjs/config';
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
    private readonly configService: ConfigService,
  ) {}

  async googleLogin(token: string): Promise<any> {
    try {
      const googlePayload =
        await this.googleAuthService.verifyGoogleToken(token);

      let user: User = await this.supabaseService.getUserByEmail(
        googlePayload.email,
      );

      // If user does not exist
      if (!user) {
        try {
          const newUser = await this.supabaseService.createUser(
            googlePayload.email,
          );
          if (newUser) user = newUser;
        } catch (error) {
          throw new Error(error);
        }
      }

      // Sign JWT token
      const accessTokenPayload = { userId: user.id, email: user.email };
      const refreshTokenPayload = { userId: user.id, email: user.email };

      const accessToken = await this.jwtService.signAsync(accessTokenPayload);
      const refreshToken = await this.jwtService.signAsync(
        refreshTokenPayload,
        {
          secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
          expiresIn: '30d',
        },
      );

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        userEmail: user.email,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
