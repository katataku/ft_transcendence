import {
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';

export class EnableTwoFactorAuthDto {
  @IsNotEmpty()
  @IsNumber()
  userId!: number;

  @IsNotEmpty()
  @IsString()
  secret!: string;

  @IsNotEmpty()
  @IsString()
  token!: string;
}

export class VerifyTwoFactorAuthDto {
  @IsNotEmpty()
  @IsNumber()
  userId!: number;

  @IsNotEmpty()
  @IsString()
  token!: string;
}

export class JwtPayloadDto {
  @IsNotEmpty()
  @IsNumber()
  userId!: number;

  @IsNotEmpty()
  @IsString()
  userName!: string;
}

export class SigninResDto {
  @IsNotEmpty()
  @IsNumber()
  userId!: number;

  @IsNotEmpty()
  @IsString()
  userName!: string;

  @IsOptional()
  @IsString()
  access_token?: string;

  @IsNotEmpty()
  @IsBoolean()
  isTwoFactorEnabled!: boolean;
}
