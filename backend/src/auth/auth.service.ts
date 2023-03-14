import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AuthService {
  async request42AuthToken(code: string): Promise<string> {
    const clientId = process.env.FTAPI_CLIENT_ID
    const clientSecret = process.env.FTAPI_CLIENT_SECRET
    const url = 'https://api.intra.42.fr/oauth/token'
    const redirectURI = 'http://localhost:3000/callback'

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
}
