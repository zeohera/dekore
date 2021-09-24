import { IsNumber } from 'class-validator';

export class ActiveAccountDto {
  email: string;

  @IsNumber()
  userId: number;
}
