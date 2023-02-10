class UserCreateReqDto {
  name: string;
  password: string;
}

class UserCreateResDto {
  id: number;
}

class UserGetDto {
  id: number;
  name: string;
}

export { UserCreateReqDto, UserCreateResDto, UserGetDto };
