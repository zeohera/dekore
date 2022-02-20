import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'bao',
  password: '101120',
  database: 'dekore_dev',
  synchronize: true,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  autoLoadEntities: true,
  logging: false,
};

export const typeOrmConfigDeploy: TypeOrmModuleOptions = {
  type: 'postgres',
  url: 'postgres://imjgvbnruvjeav:9532fb26a4a2b08ef05a53bee0c00471704eea325e3ec8034904cf33a7773017@ec2-52-206-193-199.compute-1.amazonaws.com:5432/druk8h9jcc2gi',
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: true,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  autoLoadEntities: true,
  logging: true,
};
