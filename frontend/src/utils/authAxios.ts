import axios, { type AxiosError } from 'axios'

export function request42AuthToken(
  authCode: string,
  callback: (token: string) => void
): void {
  axios
    .get(`/auth/42/${authCode}`)
    .then((res) => {
      callback(res.data)
    })
    .catch((err: AxiosError) => {
      console.log(err)
    })
}

export function get42userInfo(
  token: string,
  callback: (res: any) => void
): void {
  axios
    .get('https://api.intra.42.fr/v2/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      callback(res.data)
    })
    .catch((error) => {
      console.error(error)
    })
}
