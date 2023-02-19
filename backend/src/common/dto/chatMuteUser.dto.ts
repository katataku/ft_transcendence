import { IsNumber } from 'class-validator';

export class ChatMuteUserDto {
  @IsNumber()
  muteUserId: number;

  @IsNumber()
  mutedUserId: number;

  mute_until: Date;
}

export class ChatMuteUserPKDto {
  @IsNumber()
  muteUserId: number;

  @IsNumber()
  mutedUserId: number;
}
