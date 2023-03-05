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

export function signUp(obj: signUp, callback: (id: number) => void): void {
  if (obj.password.length < 1 || obj.name.length < 1) {
    alert('Please fill in the blanks.')
    throw new Error()
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
