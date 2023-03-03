import { IsNumberString, IsString } from 'class-validator';

export class UserCreateReqDto {
  @IsString()
  name: string;
  @IsString()
  password: string;
  @IsString()
  avatar: string;
}

export class UserCreateResDto {
  @IsNumberString()
  id: number;
}

export class UserGetDto {
  @IsNumberString()
  id: number;
  @IsString()
  name: string;
}

export class UserUpdateReqDto {
  @IsString()
  name: string;

  @IsString()
  password: string;
}

export class FriendRequestDto {
  @IsNumberString()
  from: number;
  @IsNumberString()
  to: number;
}
