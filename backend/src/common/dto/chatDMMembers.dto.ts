import { IsNotEmpty, IsNumber } from 'class-validator';

export class ChatDMMembersDto {
  @IsNotEmpty()
  @IsNumber()
  user1Id: number;

  @IsNotEmpty()
  @IsNumber()
  user2Id: number;

  @IsNotEmpty()
  @IsNumber()
  chatRoomId: number;
}

export class ChatDMMembersPKDto {
  @IsNotEmpty()
  @IsNumber()
  user1Id: number;

  @IsNotEmpty()
  @IsNumber()
  user2Id: number;
}
