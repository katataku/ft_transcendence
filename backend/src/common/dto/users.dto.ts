import {
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
  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;
}

export class UserUpdateReqDto {
  @IsString()
  name: string;
  @IsString()
  password: string;
}

export class UserAvatarUpdateReqDto {
  @IsString()
  avatar: string;
}

export class UserSignInDto {
  @IsString()
  name: string;
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
