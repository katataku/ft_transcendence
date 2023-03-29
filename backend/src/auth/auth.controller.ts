import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth42Param } from 'src/common/params/user.params';
import { UserSignInDto } from 'src/common/dto/users.dto';
import { SigninResDto } from 'src/common/dto/auth.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Public()
  @Post('signin')
  async signIn(@Body() body: UserSignInDto): Promise<SigninResDto> {
    return this.service.signIn(body);
  }

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

  @Public()
  @Get('42/:code')
  async auth42(@Param() param: Auth42Param): Promise<string> {
    const token = await this.service.request42AuthToken(param.code);
    return token;
  }
}
