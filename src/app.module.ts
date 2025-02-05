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
@Module({
  imports: [
    UsersModule,
    StoriesModule,
    TextToSpeechModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(
        __dirname,
        '../env',
        process.env.NODE_ENV === 'test' ? 'test.env' : 'development.env',
      ),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        new AppDataSource(configService).createDataSource().options,
    }),
  ],
})
export class AppModule implements NestModule {
  onModuleInit() {
    console.log(process.env.NODE_ENV, ' database is initialized.');
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
