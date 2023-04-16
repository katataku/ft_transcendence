import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class ChatBlockUserDto {
  @IsNotEmpty()
  @IsNumber()
  blockUserId: number;

  @IsNotEmpty()
  @IsNumber()
  blockedUserId: number;

  @IsNotEmpty()
  @IsDateString()
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
