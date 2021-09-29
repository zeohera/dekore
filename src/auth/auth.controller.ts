import { GetBearerToken } from './get-token.decorator';
import { TokenGuard } from './validToken.guard';
import { EmailDto } from './dto/email.dto';
import { ResetPasswordDto } from './dto/resetpassword.dto';
import { ActiveAccountDto } from './dto/active-account.dto';
import { MailService } from './../mail/mail.service';
import { User } from './entities/user.entity';
import { GetUser } from './get-user.decorator';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Request, Response } from 'express';
import { generator } from 'random-number';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  ValidationPipe,
  UseGuards,
  Req,
  Res,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { loginResponseDto } from './dto/loginResponse.dto';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) createAuthDto: CreateAuthDto,
    @Req() req: Request,
  ): Promise<void> {
    return this.authService.signUp(createAuthDto, req);
  }

  @Post('/signin')
  @ApiCreatedResponse({
    description: 'you should save these token',
    type: loginResponseDto,
  })
  async signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<loginResponseDto> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Patch('/signout')
  async signOut(@GetBearerToken() token) {
    return this.authService.signOut({ token });
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  @UseGuards(TokenGuard)
  test(@GetUser() user: User, @GetBearerToken() token) {
    console.log('token');
  }

  @Get('/active')
  @ApiCreatedResponse({
    description: 'active account',
  })
  async activeAccount(
    @Query() activeInfo: ActiveAccountDto,
    @Res() res: Response,
  ) {
    await this.authService.activeAccount(activeInfo);
    res
      .status(HttpStatus.OK)
      .json({ message: 'account activated successfully' });
  }

  @Post('/requestResetPassword')
  async requestResetPassword(@Body(ValidationPipe) emailDto: EmailDto) {
    const secretCode = generator({ min: 100000, max: 999999, integer: true })();
    const { email } = emailDto;
    await this.authService.saveSecretCode(email, secretCode);
    await this.mailService.sendSecretCode(email, secretCode);
  }

  @Patch('/resetPassword')
  async resetPassword(@Body(ValidationPipe) body: ResetPasswordDto) {
    const { password, secretCode, email } = body;
    await this.authService.resetPassword(email, secretCode, password);
    return { message: 'reset password successfully' };
  }

  // @Post()
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
