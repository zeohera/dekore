/* eslint-disable prettier/prettier */
import { APP_GUARD } from '@nestjs/core';
import { TokenGuard } from './validToken.guard';
import { TokenRepository } from './repository/token.repository';
import { ForgetPasswordCodeRepository } from './repository/forgetPasswordCode.repository';
import { MailService } from './../mail/mail.service';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      ForgetPasswordCodeRepository,
      TokenRepository,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'top5secret',
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    MailService,
    // {
    //   provide: APP_GUA RD,
    //   useClass: TokenGuard,
    // },
  ],
  exports: [
    JwtStrategy,
    PassportModule,
    AuthService
  ],
})
export class AuthModule {}
