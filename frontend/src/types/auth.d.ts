interface EnableTwoFactorAuth {
  userId: number;
  secret: string;
  token: string;
}

interface VerifyTwoFactorAuth {
  userId: number;
  token: string;
}
