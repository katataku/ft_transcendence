import {
  IsBoolean,
  IsDateString,
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
  @IsDateString()
  ban_until?: Date;

  @IsOptional()
  @IsDateString()
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
