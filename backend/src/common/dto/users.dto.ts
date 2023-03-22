import {
  IsInt,
  IsNumber,
  IsNumberString,
  IsString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class UserSignUpReqDto {
  @IsString()
  name: string;
  @IsString()
  password: string;
  @IsString()
  avatar: string;
}

export class UserSignUpResDto {
  @IsNumberString()
  id: number;
}

export class UserGetDto {
  @IsNumberString()
  id: number;
  @IsString()
  name: string;
  @IsBoolean()
  isTwoFactorEnabled: boolean;
  @IsOptional()
  @IsString()
  otpSecret?: string;
}

export class UserUpdateReqDto {
  @IsString()
  name: string;
  @IsString()
  password: string;
}

export class UserSignInDto {
  @IsInt()
  id: number;
  @IsString()
  password: string;
}

export class FriendRequestDto {
  @IsNumber()
  from: number;
  @IsNumber()
  to: number;
}

export class UserMatchHistoryDto {
  @IsNumber()
  wins: number;
  @IsNumber()
  losses: number;
}

export class UserFriendDeleteRequestDto {
  @IsNumber()
  friendUserId: number;
}

export interface UsernameCheckRequestDto {
  username: string;
}

export interface UsernameCheckResponseDto {
  message: string;
}
