import {
  IsNumber,
  IsNumberString,
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class UserSignUpReqDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsString()
  avatar: string;
  @IsNotEmpty()
  @IsBoolean()
  is42User: boolean;
}

export class UserSignUpResDto {
  @IsNotEmpty()
  @IsNumberString()
  id: number;
}

export class User42SignUpReqDto {
  @IsNotEmpty()
  @IsString()
  token: string;
  @IsNotEmpty()
  @IsString()
  userName: string;
}

export class UserGetDto {
  @IsNotEmpty()
  @IsNumberString()
  id: number;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsBoolean()
  isTwoFactorEnabled: boolean;
  @IsOptional()
  @IsString()
  otpSecret?: string;
  @IsNotEmpty()
  @IsBoolean()
  is42User: boolean;
  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;
}

export class UserUpdateReqDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserAvatarUpdateReqDto {
  @IsNotEmpty()
  @IsString()
  avatar: string;
}

export class UserSignInDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class FriendRequestDto {
  @IsNotEmpty()
  @IsNumber()
  from: number;
  @IsNotEmpty()
  @IsNumber()
  to: number;
}

export class UserMatchHistoryDto {
  @IsNotEmpty()
  @IsNumber()
  wins: number;
  @IsNotEmpty()
  @IsNumber()
  losses: number;
}

export class UserFriendDeleteRequestDto {
  @IsNotEmpty()
  @IsNumber()
  friendUserId: number;
}

export class UsernameCheckRequestDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}

export class UsernameCheckResponseDto {
  @IsNotEmpty()
  @IsString()
  message: string;
}
