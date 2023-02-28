import { IsBoolean, IsNumber } from 'class-validator';

export class ChatRoomMembersDto {
  @IsNumber()
  chatRoomId: number;

  @IsNumber()
  userId: number;

  ban_until?: Date;

  mute_until?: Date;

  @IsBoolean()
  isAdministrator: boolean;
}

export class ChatRoomMembersPKDto {
  @IsNumber()
  chatRoomId: number;
  @IsNumber()
  userId: number;
}
