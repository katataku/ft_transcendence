interface User {
  id: number
  name: string
  isOnline?: boolean
}

interface signUp {
  name: string
  password: string
  avatar: string
  is42User: boolean
}

interface signIn {
  name: string
  password: string
}

interface FriendRequestDto {
  from: number
  to: number
}

interface UserFriendDeleteRequestDto {
  friendUserId: number
}

interface UserMatchHistoryDto {
  wins: number
  losses: number
}

interface UsernameCheckRequestDto {
  username: string
}

interface UsernameCheckResponseDto {
  message: string
}
