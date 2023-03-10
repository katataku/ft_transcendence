interface User {
  id: number
  name: string
}

interface signUp {
  name: string
  password: string
  avatar: string
}

interface signIn {
  id: number
  password: string
}

interface FriendRequestDto {
  from: number
  to: number
}

interface UserFriendDeleteRequestDto {
  friendUserId: number
}
