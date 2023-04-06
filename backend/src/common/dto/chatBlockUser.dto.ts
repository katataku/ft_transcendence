import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

export class ChatBlockUserDto {
  @IsNotEmpty()
  @IsNumber()
  blockUserId: number;

  @IsNotEmpty()
  @IsNumber()
  blockedUserId: number;

  @IsNotEmpty()
  @IsDate()
  block_until: Date;
}

export class ChatBlockUserPKDto {
  @IsNotEmpty()
  @IsNumber()
  blockUserId: number;

  @IsNotEmpty()
  @IsNumber()
  blockedUserId: number;
}
