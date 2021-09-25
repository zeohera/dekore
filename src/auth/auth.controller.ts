import { ResetPasswordDto } from './dto/resetpassword.dto';
import { ActiveAccountDto } from './dto/active-account.dto';
import { MailService } from './../mail/mail.service';
import { User } from './entities/user.entity';
import { GetUser } from './get-user.decorator';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Request } from 'express';
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
  Query,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
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
  async signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log(user);
  }

  @Get('/active')
  async activeAccount(@Query() activeInfo: ActiveAccountDto) {
    return this.authService.activeAccount(activeInfo);
  }

  @Get('/requestResetPassword')
  async requestResetPassword(@Body('email') email: string) {
    const secretCode = generator({ min: 100000, max: 999999, integer: true })();
    await this.authService.saveSecretCode(email, secretCode);
    console.log('done');
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
