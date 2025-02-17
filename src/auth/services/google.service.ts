// google.service.ts
import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { TokenPayload } from 'google-auth-library';

@Injectable()
export class GoogleAuthService {
  private readonly oAuth2Client: OAuth2Client;
  constructor() {
    this.oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }
  async verifyGoogleToken(token: string): Promise<any> {
    console.log('Verifying Google token:', token);

    try {
      const ticket = await this.oAuth2Client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload: TokenPayload = ticket.getPayload();

      return payload;
    } catch (error) {
      console.error('Google token verification error:', error);
      throw new Error('Google token verification failed');
    }
  }
}
