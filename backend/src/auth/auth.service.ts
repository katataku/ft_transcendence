import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { toDataURL } from 'qrcode';
import { authenticator } from 'otplib';

@Injectable()
export class AuthService {
  async request42AuthToken(code: string): Promise<string> {
    const clientId = process.env.FT_API_CLIENT_ID;
    const clientSecret = process.env.FT_API_CLIENT_SECRET;
    const url = 'https://api.intra.42.fr/oauth/token';
    const redirectURI = 'http://localhost:3000/callback';

    const data = {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectURI,
    };

    try {
      const res = await axios.post(url, data);
      Logger.log(res.data);
      return res.data.access_token;
    } catch (err) {
      Logger.error(err);
    }
  }

  // TOTP シークレットキーを生成
  generateSecret(): string {
    return authenticator.generateSecret();
  }

  // QR コードを生成
  async generateQrCode(secret: string, email: string): Promise<string> {
    const otpAuthUrl = authenticator.keyuri(email, 'YourAppName', secret);
    return toDataURL(otpAuthUrl);
  }

  // TOTP トークンを検証
  verifyToken(secret: string, token: string): boolean {
    return authenticator.verify({ secret, token });
  }
}
