import axios, { type AxiosError } from 'axios'
import { defaultAvatar } from '../User/components/SignIn'

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_HTTP_BASE_URL

export function getAllUsersRequest(callback: (users: User[]) => void): void {
  axios
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
  axios
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

export function signIn(obj: signIn, callback: (user: User) => void): void {
  axios
    .post<User>('/user/sign_in', obj)
    .then((res) => {
      callback(res.data)
    })
    .catch((err: AxiosError) => {
      if (err.response?.status === 401) {
        alert('Password is incorrect.')
      } else {
        alert('Unknown Error.')
      }
    })
}
export async function getAvatar(userId: number): Promise<string> {
  const res = await axios.get<string>(`/user/user_avatar/${userId}`)
  return res.data
}

export function getFriendRequest(
  userId: number,
  callback: (user: User[]) => void
): void {
  axios
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
  axios
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
  axios
    .post('/user/friends', requestData)
    .then((_response) => {
      callback()
    })
    .catch((reason) => {
      alert('エラーです！')
      console.log(reason)
    })
}

export function deleteFriendPendingRequest(
  requestData: FriendRequestDto,
  callback: () => void
): void {
  axios
    .delete<FriendRequestDto>('/user/friends/pending', { data: requestData })
    .then((_response) => {
      callback()
    })
    .catch((reason) => {
      alert('エラーです！')
      console.log(reason)
    })
}
