import { Injectable, Logger } from '@nestjs/common';
import axios, { type AxiosResponse } from 'axios';
import { toDataURL } from 'qrcode';
import { authenticator } from 'otplib';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UserSignInDto } from 'src/common/dto/users.dto';
import { JwtPayloadDto, LocalStorageDto } from 'src/common/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async login(user: UserSignInDto): Promise<LocalStorageDto> {
    const loggedInUser = await this.usersService.signInUser(user);
    const payload: JwtPayloadDto = {
      userId: loggedInUser.id,
      userName: loggedInUser.name,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

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

  async request42Info(token: string) {
    const url = 'https://api.intra.42.fr/v2/me';
    const headers = { Authorization: `Bearer ${token}` };
    let res: AxiosResponse;
    try {
      res = await axios.get(url, { headers });
    } catch (err) {
      Logger.error(err);
    }
    return res.data;
  }

  async getAvatar42(url: string): Promise<string> {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const data = Buffer.from(response.data, 'binary').toString('base64');
      return data;
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
