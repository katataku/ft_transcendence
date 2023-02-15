export class UserCreateReqDto {
  name: string;
  password: string;
}

export class UserCreateResDto {
  id: number;
}

export class UserGetDto {
  id: number;
  name: string;
}

export class FriendRequestDto {
  from: number;
  to: number;
}
