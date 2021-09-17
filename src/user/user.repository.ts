import { User } from './entities/user.entity';
import { Entity, EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {}