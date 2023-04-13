interface ChatRoom {
  id: number
  name: string
  owner_id: number
  public_id: publicIdType
  password?: string
}

interface ChatRoomReqDto {
  name: string
  created_by: number
  owner_id: number
  public_id: publicIdType
  password?: string
}

interface ChatRoomAuthReqDto {
  password: string
}

type publicIdType = 'public' | 'private' | 'protected' | 'DM'
