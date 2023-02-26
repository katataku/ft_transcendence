import { IsBoolean, IsNumber } from 'class-validator';

export class ChatRoomMembersDto {
  @IsNumber()
  chatRoomId: number;

  @IsNumber()
  userId: number;

  @IsBoolean()
  isBanned: boolean;

  @IsBoolean()
  isAdministrator: boolean;
}

export class ChatRoomMembersPKDto {
  @IsNumber()
  chatRoomId: number;
  @IsNumber()
  userId: number;
}
