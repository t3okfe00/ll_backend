import { SupabaseService } from 'src/supabase/supabase.service';
import { Injectable } from '@nestjs/common';
import { GoogleAuthService } from './google.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async googleLogin(token: string): Promise<any> {
    // Verify google token may fail
    try {
      const payload = await this.googleAuthService.verifyGoogleToken(token);
      let user = await this.supabaseService.getUserByEmail(payload.email);
      console.log('USER IS ->>>>', user);
      // If user does not exist
      if (!user) {
      }
      return payload;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
