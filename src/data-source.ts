import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import path from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppDataSource {
  constructor(private configService: ConfigService) {}

  public createDataSource = () => {
    return new DataSource({
      type: this.configService.get('DATABASE_TYPE') as
        | 'postgres'
        | 'mysql'
        | 'mssql'
        | 'sqlite',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USERNAME'),
      password: this.configService.get<string>('DATABASE_PASS'),
      database: this.configService.get<string>('DATABASE_NAME'),
      entities: [User],
    });
  };
}
