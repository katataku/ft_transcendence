import { IsNumberString, isNumberString } from 'class-validator';
export class UserCreateReqDto {
  name: string;
  password: string;
}

export class UserCreateResDto {
  @IsNumberString()
  id: number;
}

export class UserGetDto {
  @IsNumberString()
  id: number;
  name: string;
}

export class FriendRequestDto {
  @IsNumberString()
  from: number;
  @IsNumberString()
  to: number;
}
