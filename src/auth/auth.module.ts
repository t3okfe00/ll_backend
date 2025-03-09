import { SupabaseService } from 'src/supabase/supabase.service';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { GoogleAuthService } from './services/google.service';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SupabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        refresh_token_secret: configService.get<string>('REFRESH_TOKEN_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleAuthService],
})
export class AuthModule {}
