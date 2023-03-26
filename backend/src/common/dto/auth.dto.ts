import { IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';

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

export class JwtPayloadDto {
  @IsNumber()
  userId!: number;

  @IsString()
  userName!: string;
}

export class SigninResDto {
  @IsNumber()
  userId!: number;

  @IsString()
  userName!: string;

  @IsOptional()
  @IsString()
  access_token?: string;

  @IsBoolean()
  isTwofactorEnabled!: boolean;
}
