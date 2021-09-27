import { LogOutDto } from './dto/logout.dto';
import { TokenRepository } from './repository/token.repository';
import { loginResponseDto } from './dto/loginResponse.dto';
import { ForgetPasswordCodeRepository } from './repository/forgetPasswordCode.repository';
import { ActiveAccountDto } from './dto/active-account.dto';
import { MailService } from './../mail/mail.service';
import { JwtPayload } from './jwt-payload.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { format } from 'url';
import { MoreThan } from 'typeorm';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private tokenRepository: TokenRepository,
    private forgetPasswordCodeRepository: ForgetPasswordCodeRepository,
    private JwtService: JwtService,
    private mailService: MailService,
  ) {}
  async signUp(createAuthDto: CreateAuthDto, req): Promise<void> {
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
  ): Promise<loginResponseDto> {
    const { username, isActive, id } =
      await this.userRepository.validateUserPassword(authCredentialsDto);
    if (!username) {
      throw new UnauthorizedException('invalid credenticals');
    }
    if (isActive === false || !isActive) {
      throw new UnauthorizedException('you need to active this account');
    }
    const payload: JwtPayload = { username };
    const accessToken = await this.JwtService.sign({
      ...payload,
      type: 'access',
    });
    const refreshToken = await this.JwtService.sign({
      ...payload,
      type: 'refresh',
    });
    console.log(this.tokenRepository);
    await this.tokenRepository.save({
      accessToken,
      refreshToken,
      userId: id,
    });
    const result: loginResponseDto = {
      accessToken,
      refreshToken,
    };
    return result;
  }

  async signOut(token: LogOutDto) {
    await this.tokenRepository.signOut(token);
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
    const minutesAgo = moment().subtract(5, 'minutes');
    const check = await this.forgetPasswordCodeRepository.findOne({
      email: email,
      code: secretCode,
      updated_at: MoreThan(minutesAgo),
    });
    if (check.id) {
      this.tokenRepository.update({ userId: check.id }, { state: false });
      return await this.userRepository.resetPassword(email, password);
    } else
      throw new UnauthorizedException(
        'your secret is out of date or may be replaced',
      );
  }
  async checkActive(token: string) {
    return this.tokenRepository.checkActive(token);
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
