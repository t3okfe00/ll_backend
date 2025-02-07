import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@nestjs/config';
import { AppDataSource } from './data-source';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { StoriesModule } from './stories/stories.module';
import { TextToSpeechModule } from './text-to-speech/textToSpeech.module';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.join(
          process.cwd(),
          'env',
          process.env.NODE_ENV === 'test' ? 'test.env' : 'development.env',
        ),
        path.join(process.cwd(), '.env'), // Fallback
      ],
    }),
    UsersModule,
    StoriesModule,
    TextToSpeechModule,

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new AppDataSource(configService).createDataSource().options,
    }),
    AuthModule,
    SupabaseModule,
  ],
})
export class AppModule implements NestModule {
  constructor(private configService: ConfigService) {
    console.log(
      'Resolved ENV file path:',
      path.resolve(
        __dirname,
        '../env',
        process.env.NODE_ENV === 'test' ? 'test.env' : 'development.env',
      ),
    );
  }
  onModuleInit() {
    console.log(process.env.NODE_ENV, ' database is initialized.');
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
