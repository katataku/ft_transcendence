interface EnableTwoFactorAuth {
  userId: number
  secret: string
  token: string
}

interface VerifyTwoFactorAuth {
  userId: number
  token: string
}

interface jwtPayload {
  userId: number
  userName: string
}

interface SigninRes {
  userId: number
  userName: string
  access_token?: string
  isTwoFactorEnabled: boolean
}
