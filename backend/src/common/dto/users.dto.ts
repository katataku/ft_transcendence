import {
  IsNumber,
  IsNumberString,
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class UserSignUpReqDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  @Matches(
    // 小文字、大文字、数字、記号を含む8文字以上
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long and contain uppercase letters, lowercase letters, numbers, and symbols.',
    },
  )
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
  @Matches(
    // 小文字、大文字、数字、記号を含む8文字以上
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long and contain uppercase letters, lowercase letters, numbers, and symbols.',
    },
  )
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
