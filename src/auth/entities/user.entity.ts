import { Token } from './token.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  Unique,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Task } from './../../tasks/task.entity';

@Entity()
@Unique(['username'])
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  email: string;

  @Column()
  isActive: boolean;

  @Column()
  isAdmin: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

  @OneToMany((type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  @OneToMany((type) => Token, (token) => token.user, { eager: true })
  tokens: Token[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
