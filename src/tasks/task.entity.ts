import { User } from './../auth/entities/user.entity';
import { TaskStatus } from './task-status.enum';
import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: true })
  title: string;

  @Column({ type: 'varchar', default: true })
  description: string;

  @Column({ type: 'varchar', default: true })
  status: TaskStatus;

  @ManyToOne((type) => User, (user) => user.tasks, { eager: false })
  user: User;

  @Column()
  userId: number;
}
