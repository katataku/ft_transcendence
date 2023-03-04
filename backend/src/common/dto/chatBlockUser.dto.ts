import { IsNumber } from 'class-validator';

export class ChatBlockUserDto {
  @IsNumber()
  blockUserId: number;

  @IsNumber()
  blockedUserId: number;

  block_until: Date;
}

export class ChatBlockUserPKDto {
  @IsNumber()
  blockUserId: number;

  @IsNumber()
  blockedUserId: number;
}
