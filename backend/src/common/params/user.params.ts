import { IsNumberString, IsString, IsNotEmpty } from 'class-validator';

export class UserIdParam {
  @IsNotEmpty()
  @IsNumberString()
  id!: number;
}

export class UserNameParam {
  @IsNotEmpty()
  @IsString()
  userName!: string;
}

export class Auth42Param {
  @IsNotEmpty()
  @IsString()
  code!: string;
}

export class login42Param {
  @IsNotEmpty()
  @IsString()
  token!: string;
}
