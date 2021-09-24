import { PasswordConfirm } from './PasswordConfirm';
import { IsNumber, IsNotEmpty, isEmail, IsEmail } from 'class-validator';

export class ResetPasswordDto extends PasswordConfirm {
  @IsNotEmpty()
  @IsNumber()
  secretCode: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
