import { TaskStatus } from './task-status.enum';
import { BaseEntity, PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

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
}
