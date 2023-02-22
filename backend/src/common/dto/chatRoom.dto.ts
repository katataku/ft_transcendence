export interface ChatRoomResDto {
  id: number;
  name: string;
  created_by_user_id: number;
  public_id: number;
}

export interface ChatRoomReqDto {
  id?: number;
  name: string;
  created_by_user_id: number;
  public_id: number;
  password?: string;
}
