interface ChatRoom {
  id: number
  name: string
  created_by_user_id: number
  public_id: publicIdType
  password?: string
}

interface ChatRoomReqDto {
  name: string
  created_by: number
  created_by_user_id: number
  public_id: publicIdType
  password?: string
}

interface ChatRoomAuthReqDto {
  password: string
}

type publicIdType = 'public' | 'private' | 'protected' | 'DM'
