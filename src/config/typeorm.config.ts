import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '101120',
  database: 'dekore_dev',
  synchronize: true,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  autoLoadEntities: true,
  logging: true,
};

export const typeOrmConfigDeploy: TypeOrmModuleOptions = {
  type: 'postgres',
  url: 'postgres://imjgvbnruvjeav:9532fb26a4a2b08ef05a53bee0c00471704eea325e3ec8034904cf33a7773017@ec2-52-206-193-199.compute-1.amazonaws.com:5432/druk8h9jcc2gi',
  // url: process.env[DATABASE_URL] + '?sslmode=require',
  // host: 'ec2-52-206-193-199.compute-1.amazonaws.com',
  // port: 5432,
  // username: 'imjgvbnruvjeav',
  // password: '9532fb26a4a2b08ef05a53bee0c00471704eea325e3ec8034904cf33a7773017',
  // database: 'druk8h9jcc2gi',
  ssl: {
    rejectUnauthorized: false,
  },
  // native: true,
  // timezone: '+07:00',
  synchronize: true,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  autoLoadEntities: true,
  logging: true,
};
