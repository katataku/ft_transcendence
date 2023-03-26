import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth42Param } from 'src/common/params/user.params';
import { UserSignInDto } from 'src/common/dto/users.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { SigninResDto } from 'src/common/dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('signin')
  async signIn(@Body() body: UserSignInDto): Promise<SigninResDto> {
    return this.service.signIn(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  async getProtectedData(@Request() req) {
    /*
      req.user は以下のようなオブジェクト
      {
        "userId": 10,
        "userName": "hello",
        "iat": 1679569772,
        "exp": 1679573372
      }
      idとnameはauth.service.tsのloginメソッドのpayloadに入っている
    */
    return req.user;
  }

  @Get('42/:code')
  async auth42(@Param() param: Auth42Param): Promise<string> {
    const token = await this.service.request42AuthToken(param.code);
    return token;
  }
}
