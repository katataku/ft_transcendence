import { IsNumberString } from 'class-validator';

export class UserGetParam {
  @IsNumberString()
  id: number;
}
