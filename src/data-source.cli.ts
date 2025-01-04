// data-source.cli.ts (For TypeORM migration generation)
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import * as dotenv from 'dotenv';

dotenv.config({ path: `env/${process.env.NODE_ENV || 'development'}.env` });

export const AppDataSource = new DataSource({
  type: process.env.DATABASE_TYPE as 'postgres' | 'mysql' | 'mssql' | 'sqlite',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  entities: [User],
  migrations: ['migrations/*.ts'],
});
