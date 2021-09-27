import { AuthService } from './../auth/auth.service';
import { AuthModule } from './../auth/auth.module';
import { TaskRepository } from './task.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskRepository]),
    AuthModule,
    // AuthService,
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    TaskRepository,
    // AuthService,
  ],
})
export class TasksModule {}
