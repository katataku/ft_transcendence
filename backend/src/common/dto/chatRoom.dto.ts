import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export interface ChatRoomResDto {
  id: number;
  name: string;
  owner_id: number;
  public_id: publicIdType;
}

export class ChatRoomReqDto {
  @IsOptional()
  @IsNumber()
  id?: number;
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsNumber()
  owner_id: number;
  @IsNotEmpty()
  @IsIn(['public', 'private', 'protected', 'DM'])
  public_id: publicIdType;
  @IsOptional()
  @IsString()
  password?: string;
}

export class ChatRoomAuthReqDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}

export type publicIdType = 'public' | 'private' | 'protected' | 'DM';
