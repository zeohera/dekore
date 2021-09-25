import { PasswordConfirm } from './PasswordConfirm';
import { IsNumber, IsNotEmpty, isEmail, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto extends PasswordConfirm {
  @ApiProperty({
    description: 'secret code has 6 numbers and is sent to personal email',
  })
  @IsNotEmpty()
  @IsNumber()
  secretCode: number;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
