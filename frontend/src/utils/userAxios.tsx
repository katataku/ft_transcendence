import axios from 'axios'
import { defaultAvatar } from '../User/components/SignIn'
import jwtAxios from './axiosConfig'

export function getAllUsersRequest(callback: (users: User[]) => void): void {
  jwtAxios
    .get<User[]>('/user/users')
    .then((response) => {
      callback(response.data)
    })
    .catch((reason) => {
      alert('エラーです！')
      console.log(reason)
    })
}

export function getUserRequest(
  userId: number,
  callback: (user: User) => void
): void {
  jwtAxios
    .get<User>('/user/' + String(userId))
    .then((response) => {
      callback(response.data)
    })
    .catch((reason) => {
      alert('エラーです！')
      console.log(reason)
    })
}

export function signUp(obj: signUp, callback: (id: number) => void): void {
  if (obj.password.length < 1 || obj.name.length < 1) {
    alert('Please fill in the blanks.')
    throw new Error()
  }
  if (obj.avatar === defaultAvatar) {
    obj.avatar = 'DEFAULT_AVATAR'
  }

  axios
    .post<{ id: number }>('/user', obj)
    .then((res) => {
      callback(res.data.id)
    })
    .catch((err) => {
      alert(err)
    })
}

export function signIn42(token: string, callback: (res: any) => void): void {
  axios
    .get(`auth/42/login/${token}`)
    .then((res) => {
      callback(res.data)
    })
    .catch((err) => {
      alert(err)
    })
}

export async function getAvatar(userId: number): Promise<string> {
  const res = await jwtAxios.get<string>(`/user/user_avatar/${userId}`)
  return res.data
}

export function getFriendRequest(
  userId: number,
  callback: (user: User[]) => void
): void {
  jwtAxios
    .get<User[]>('/user/friends/' + String(userId))
    .then((response) => {
      callback(response.data)
    })
    .catch((reason) => {
      alert('エラーです！')
      console.log(reason)
    })
}

export function getFriendPendingRequest(
  userId: number,
  callback: (user: User[]) => void
): void {
  jwtAxios
    .get<User[]>('/user/friends/pending/' + String(userId))
    .then((response) => {
      callback(response.data)
    })
    .catch((reason) => {
      alert('エラーです！')
      console.log(reason)
    })
}

export function updateFriendPendingRequest(
  requestData: FriendRequestDto,
  callback: () => void
): void {
  jwtAxios
    .post('/user/friends', requestData)
    .then((_response) => {
      callback()
    })
    .catch((reason) => {
      alert('エラーです！')
      console.log(reason)
    })
}

export function deleteFriendRequest(
  userID: number,
  friendID: number,
  callback: () => void
): void {
  const requestData: UserFriendDeleteRequestDto = {
    friendUserId: friendID
  }
  jwtAxios
    .delete<UserFriendDeleteRequestDto>('/user/friends/' + String(userID), {
      data: requestData
    })
    .then((_response) => {
      callback()
    })
    .catch((reason) => {
      alert('エラーです！')
      console.log(reason)
    })
}

export function deleteFriendPendingRequest(
  from: number,
  to: number,
  callback: () => void
): void {
  jwtAxios
    .delete<FriendRequestDto>(
      '/user/friends/pending/' + String(from) + '/' + String(to)
    )
    .then((_response) => {
      callback()
    })
    .catch((reason) => {
      alert('エラーです！')
      console.log(reason)
    })
}

export function getFriendsRequest(
  userId: number,
  callback: (user: User[]) => void
): void {
  jwtAxios
    .get<User[]>('/user/friends/' + String(userId))
    .then((response) => {
      callback(response.data)
    })
    .catch((reason) => {
      alert('エラーです！')
      console.log(reason)
    })
}

export function getMatchHistoryById(
  id: number,
  callback: (matchHistory: UserMatchHistoryDto) => void
): void {
  jwtAxios
    .get<UserMatchHistoryDto>('/user/match_history/' + String(id))
    .then((response) => {
      callback(response.data)
    })
    .catch((err) => {
      alert(err)
    })
}

export function checkUsernameAvailability(
  username: string,
  callbackOK: () => void,
  callbackNG: () => void
): void {
  const requestData: UsernameCheckRequestDto = {
    username
  }
  axios
    .post('/user/check/username-availability', requestData)
    .then((_response) => {
      callbackOK()
    })
    .catch((err) => {
      if (err.response.data.message === 'Username already exists') callbackNG()
    })
}
