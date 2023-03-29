import axios, { type AxiosError } from 'axios'
import { localStorageKey } from '../constants'

export function signIn(
  loginData: signIn,
  callback: (res: IlocalStorage) => void
): void {
  axios
    .post('/auth/login', loginData)
    .then((res): void => {
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

export function validateJwtToken(
  success: (res: jwtPayload) => void,
  fail: () => void
): void {
  const jwtToken: string | null = localStorage.getItem(localStorageKey)
  if (jwtToken === null) {
    fail()
    return
  }

  axios
    .get('/auth/protected', {
      headers: {
        Authorization: 'Bearer ' + jwtToken
      }
    })
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

export function getOTPData(
  userId: number,
  callback: (res: { secret: string; qrCode: string }) => void
): void {
  axios
    .get<{ secret: string; qrCode: string }>(`/auth/2fa/setup/${userId}`)
    .then((res): void => {
      callback(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
}

export function enable2FA(
  enableTwoFactorAuth: EnableTwoFactorAuth,
  callback: (res: any) => void
): void {
  axios
    .post('/auth/2fa/enable', enableTwoFactorAuth)
    .then((res): void => {
      callback(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
}

export function disable2FA(userId: number, callback: (res: any) => void): void {
  axios
    .post('/auth/2fa/disable', { userId })
    .then((res): void => {
      callback(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
}

export function getIsTwoFactorEnabled(
  userId: number,
  callback: (res: boolean) => void
): void {
  axios
    .get<boolean>('/auth/2fa/status', {
      params: {
        userId
      }
    })
    .then((res): void => {
      callback(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
}

export function verifyOTP(
  verifyTwoFactorAuth: VerifyTwoFactorAuth,
  callback: (res: boolean) => void
): void {
  axios
    .post('/auth/2fa/verify', verifyTwoFactorAuth)
    .then((res): void => {
      callback(res.data)
    })
    .catch((err) => {
      console.log(err)
    })
}
