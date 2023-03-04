import axios, { type AxiosError } from 'axios'

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

export async function signUp(obj: signUp): Promise<{id: number}> {
  const res: {id: number} = (await axios.post('/user', obj)).data
  return res
}

export async function signIn(obj: signIn): Promise<User> {
  const res = await axios.post('/user/sign_in', obj).catch((err: AxiosError) => {
    if (err.response?.status === 401) {
      throw new Error('Password is incorrect.')
    } else {
      throw new Error('Unknown Error.')
    }
  })
  return res.data as User
}

export async function getAvatar(userId: number): Promise<string> {
  const res = await axios.get<string>(`/user/user_avatar/${userId}`)
  return res.data
}
