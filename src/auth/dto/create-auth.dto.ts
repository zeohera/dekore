import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { AuthCredentialsDto } from './auth-credentials.dto';
export class CreateAuthDto extends AuthCredentialsDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
