import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from './supabase.service';
import { createClient } from '@supabase/supabase-js';
import { S3Client } from '@aws-sdk/client-s3';

@Module({
  providers: [
    SupabaseService,
    {
      provide: 'SUPABASE_CLIENT',
      useFactory: (configService: ConfigService) => {
        const supabaseUrl = configService.get<string>('SUPABASE_URL');
        const supabaseKey = configService.get<string>('SUPABASE_KEY');
        console.log('Creating Supabase client', supabaseUrl, supabaseKey);
        return createClient(supabaseUrl, supabaseKey);
      },
      inject: [ConfigService],
    },
    {
      provide: 'S3_CLIENT',
      useFactory: (configService: ConfigService) => {
        const s3Region = configService.get<string>('S3_REGION');
        const s3Endpoint = configService.get<string>('S3_ENDPOINT');
        const s3AccessKeyId = configService.get<string>('S3_ACCESS_KEY_ID');
        const s3SecretAccessKey = configService.get<string>(
          'S3_SECRET_ACCESS_KEY',
        );

        return new S3Client({
          forcePathStyle: true,
          region: s3Region,
          endpoint: s3Endpoint,
          credentials: {
            accessKeyId: s3AccessKeyId,
            secretAccessKey: s3SecretAccessKey,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [SupabaseService],
})
export class SupabaseModule {}
