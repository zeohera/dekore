import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '101120',
  database: 'dekore_dev',
  entities: [__dirname + '/../**/*.entity.ts'],
  synchronize: true,
};
