import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class ChatRoomMembersDto {
  @IsNotEmpty()
  @IsNumber()
  chatRoomId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsOptional()
  @IsDate()
  ban_until?: Date;

  @IsOptional()
  @IsDate()
  mute_until?: Date;

  @IsNotEmpty()
  @IsBoolean()
  isAdministrator: boolean;
}

export class ChatRoomMembersPKDto {
  @IsNotEmpty()
  @IsNumber()
  chatRoomId: number;
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
