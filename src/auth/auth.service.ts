import { ForgetPasswordCodeRepository } from './repository/forgetPasswordCode.repository';
import { ActiveAccountDto } from './dto/active-account.dto';
import { MailService } from './../mail/mail.service';
import { JwtPayload } from './jwt-payload.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { format } from 'url';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private forgetPasswordCodeRepository: ForgetPasswordCodeRepository,
    private JwtService: JwtService,
    private mailService: MailService,
  ) {}
  async signUp(createAuthDto: CreateAuthDto, req): Promise<void> {
    console.log(req.headers.host);
    const user = await this.userRepository.signUp(createAuthDto);
    const activeLink = format({
      protocol: req.protocol,
      host: req.headers.host,
      pathname: 'auth/active',
      query: { userId: user.id, email: user.email },
    });
    await this.mailService.sendUserActiveLink(user.email, activeLink);
  }
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, isActive } =
      await this.userRepository.validateUserPassword(authCredentialsDto);
    if (!username) {
      throw new UnauthorizedException('invalid credenticals');
    }
    if (isActive === false || !isActive) {
      throw new UnauthorizedException('you need to active this account');
    }
    const payload: JwtPayload = { username };
    const accessToken = await this.JwtService.sign(payload);
    return { accessToken };
  }
  async activeAccount(activeInfo: ActiveAccountDto) {
    const active = true;
    const { userId, email } = activeInfo;
    await this.userRepository.changeState(userId, active, email);
  }

  async saveSecretCode(email: string, secretCode: number) {
    console.log(email, secretCode);
    this.forgetPasswordCodeRepository.saveSecretCode(email, secretCode);
  }

  async resetPassword(email: string, secretCode: number, password: string) {
    const check = await this.forgetPasswordCodeRepository.count({
      email: email,
      code: secretCode,
    });
    if (check === 1) {
      return await this.userRepository.resetPassword(email, password);
    }
  }
  // create(createAuthDto: CreateAuthDto) {
  //   return 'This action adds a new auth';
  // }
  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
