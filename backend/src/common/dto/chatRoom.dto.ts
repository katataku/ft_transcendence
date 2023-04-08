export interface ChatRoomResDto {
  id: number;
  name: string;
  owner_id: number;
  public_id: publicIdType;
}

export interface ChatRoomReqDto {
  id?: number;
  name: string;
  owner_id: number;
  public_id: publicIdType;
  password?: string;
}

export interface ChatRoomAuthReqDto {
  id: number;
  password: string;
}

export type publicIdType = 'public' | 'private' | 'protected' | 'DM';
