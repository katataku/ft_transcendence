import { IsNumberString } from 'class-validator';

export class UserIdParam {
  @IsNumberString()
  id: number;
}
