import { CreateAuthDto } from './../dto/create-auth.dto';
import { AuthCredentialsDto } from './../dto/auth-credentials.dto';
import { Repository, EntityRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(createAuthDto: CreateAuthDto): Promise<User> {
    const { username, password, email } = createAuthDto;
    const user = new User();
    user.username = username;
    user.email = email;
    const salt = await bcrypt.genSalt();
    user.salt = salt;
    user.isActive = false;
    user.isAdmin = false;
    user.password = await this.hashPassword(password, salt);
    try {
      await user.save();
      return user;
    } catch (error) {
      console.log(error.code);
      if (error.code == 23505) {
        throw new ConflictException('username or email already exists');
      } else throw new InternalServerErrorException();
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ username: string; isActive: boolean; id: number }> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    if (user && (await user.validatePassword(password))) {
      const { username, isActive, id } = user;
      return { username, id, isActive };
    } else throw new UnauthorizedException('wrong username or password');
  }

  async changeState(userId: number, state: boolean, email: string) {
    const user = await this.update({ id: userId, email }, { isActive: state });
    console.log('user', user.affected);
    if (user.affected === 0) {
      throw new NotFoundException('user not found');
    }
  }

  async resetPassword(email: string, password: string) {
    const { salt } = await this.findOne({ email });
    const hassedPassword = await this.hashPassword(password, salt);
    return await this.update({ email }, { password: hassedPassword });
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
