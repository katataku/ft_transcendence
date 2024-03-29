import axios, { type AxiosError } from 'axios'
import jwtAxios from './axiosConfig'

export function signIn(
  signInData: signIn,
  callback: (res: SigninRes) => void
): void {
  axios
    .post('/auth/signin', signInData)
    .then((res): void => {
      callback(res.data)
    })
    .catch((err: AxiosError) => {
      if (err.response?.status === 401) {
        alert('Password is incorrect.')
      } else if (err.response?.status === 404) {
        alert('User not found.')
      } else {
        alert('Unknown Error.')
      }
    })
}

/**
 * このリクエストでOnline状態とみなします。
 */
export function validateJwtToken(
  success: (res: jwtPayload) => void,
  fail: () => void
): void {
  jwtAxios
    .get('/auth/protected')
    .then((res) => {
      // res.data is like:
      // {
      // 	"userId": 10,
      // 	"userName": "hello",
      // 	"iat": 1679569772,
      // 	"exp": 1679573372
      //   }
      success(res.data)
    })
    .catch(() => {
      fail()
    })
}

export function request42AuthToken(
  authCode: string,
  callback: (res: SigninRes | string) => void
): void {
  axios
    .post(`/auth/42/${authCode}`)
    .then((res) => {
      callback(res.data)
    })
    .catch((err: AxiosError) => {
      console.log(err)
    })
}

export function getOTPData(
  userName: string,
  callback: (res: { secret: string; qrCode: string }) => void
): void {
  jwtAxios
    .get<{ secret: string; qrCode: string }>(`/auth/2fa/setup/${userName}`)
    .then((res): void => {
      callback(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
}

export function enable2FA(
  enableTwoFactorAuth: EnableTwoFactorAuth,
  callback: (isEnabled: boolean) => void
): void {
  jwtAxios
    .post('/auth/2fa/enable', enableTwoFactorAuth)
    .then((res): void => {
      callback(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
}

export function disable2FA(callback: (res: any) => void): void {
  jwtAxios
    .post('/auth/2fa/disable')
    .then((res): void => {
      callback(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
}

export function getIsTwoFactorEnabled(callback: (res: boolean) => void): void {
  jwtAxios
    .get<boolean>('/auth/2fa/status')
    .then((res): void => {
      callback(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
}

export function verifyOTP(
  verifyTwoFactorAuth: VerifyTwoFactorAuth,
  callback: (accessToken: string) => void
): void {
  jwtAxios
    .post('/auth/2fa/verify', verifyTwoFactorAuth)
    .then((res): void => {
      callback(res.data)
    })
    .catch((err: AxiosError) => {
      if (err.response?.status === 401) {
        alert((err.response?.data as any).message)
      } else if (err.response?.status === 404) {
        alert((err.response?.data as any).message)
      } else {
        alert('Unknown Error.')
      }
    })
}
