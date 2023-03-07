import { IsNumber } from 'class-validator';

export class ChatDMMembersDto {
  @IsNumber()
  user1Id: number;

  @IsNumber()
  user2Id: number;

  @IsNumber()
  chatRoomId: number;
}

export class ChatDMMembersPKDto {
  @IsNumber()
  user1Id: number;

  @IsNumber()
  user2Id: number;
}
