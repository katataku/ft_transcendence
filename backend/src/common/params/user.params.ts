import { IsNumberString, IsString } from 'class-validator';

export class UserIdParam {
  @IsNumberString()
  id: number;
}

export class Auth42Param {
  @IsString()
  code: string;
}

export class login42Param {
  @IsString()
  token: string
}
