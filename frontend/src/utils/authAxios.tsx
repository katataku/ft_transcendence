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
