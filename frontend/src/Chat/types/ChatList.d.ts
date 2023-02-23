interface ChatRoom {
  id: number
  name: string
  created_by_user_id: number
  is_public: boolean
}

interface ChatRoomReqDto {
  name: string
  created_by: number
  created_by_user_id: number
  is_public: boolean
}
