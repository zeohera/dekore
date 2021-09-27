import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { AuthCredentialsDto } from './auth-credentials.dto';
export class LogOutDto {
  @ApiProperty()
  @IsNotEmpty()
  token: string;
}
