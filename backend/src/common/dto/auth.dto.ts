import { IsNumber, IsString } from 'class-validator';

export class EnableTwoFactorAuthDto {
  @IsNumber()
  userId!: number;

  @IsString()
  secret!: string;

  @IsString()
  token!: string;
}

export class VerifyTwoFactorAuthDto {
  @IsNumber()
  userId!: number;

  @IsString()
  token!: string;
}
