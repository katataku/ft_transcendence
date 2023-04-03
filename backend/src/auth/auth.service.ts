import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { toDataURL } from 'qrcode';
import { authenticator } from 'otplib';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UserSignInDto } from 'src/common/dto/users.dto';
import {
  EnableTwoFactorAuthDto,
  JwtPayloadDto,
  SigninResDto,
  VerifyTwoFactorAuthDto,
} from 'src/common/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async signIn(user: UserSignInDto): Promise<SigninResDto> {
    const loggedInUser = await this.usersService.signInUser(user);
    const isTwoFactorEnabled = await this.usersService.isTwoFactorEnabled(
      loggedInUser.id,
    );
    const payload: JwtPayloadDto = {
      userId: loggedInUser.id,
      userName: loggedInUser.name,
    };

    return {
      userId: loggedInUser.id,
      userName: loggedInUser.name,
      access_token: isTwoFactorEnabled ? null : this.jwtService.sign(payload),
      isTwoFactorEnabled: isTwoFactorEnabled,
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
      const res: token42Response = (await axios.post(url, data)).data;
      return res.access_token;
    } catch (err) {
      Logger.error(err);
    }
  }

  async request42Info(token: string): Promise<ftInfo> {
    const url = 'https://api.intra.42.fr/v2/me';
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const res = (await axios.get(url, { headers })).data;
      const info: ftInfo = {
        login: res.login,
        imageLink: res.image.link
      };
      return info;
    } catch (err) {
      Logger.error(err);
    }
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

  private generateSecret(): string {
    return authenticator.generateSecret();
  }

  private async generateQrCode(
    secret: string,
    userId: string,
  ): Promise<string> {
    const otpAuthUrl = authenticator.keyuri(userId, 'ft_transcendence', secret);
    return toDataURL(otpAuthUrl);
  }

  async getOTPData(
    userName: string,
  ): Promise<{ secret: string; qrCode: string }> {
    const secret = this.generateSecret();
    const qrCode = await this.generateQrCode(secret, userName);
    return {
      secret: secret,
      qrCode: qrCode,
    };
  }

  async enable(data: EnableTwoFactorAuthDto): Promise<boolean> {
    const isValid = authenticator.verify({
      secret: data.secret,
      token: data.token,
    });
    if (isValid) {
      await this.usersService.enableTwoFactor(data.userId, data.secret);
    }
    return isValid;
  }

  async verifyOtp(data: VerifyTwoFactorAuthDto): Promise<string> {
    const user = await this.usersService.getUserById(data.userId);
    if (user.otpSecret == null) {
      throw new HttpException('2FA is invalid .', HttpStatus.NOT_FOUND);
    }
    const secret = user.otpSecret;

    const isValid = authenticator.verify({ secret, token: data.token });
    if (!isValid)
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);

    const payload: JwtPayloadDto = {
      userId: user.id,
      userName: user.name,
    };
    return this.jwtService.sign(payload);
  }
}
