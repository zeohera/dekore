import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { AuthCredentialsDto } from './auth-credentials.dto';
export class CreateAuthDto extends AuthCredentialsDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
