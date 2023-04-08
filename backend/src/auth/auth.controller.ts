import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth42Param } from 'src/common/params/user.params';
import { UserSignInDto } from 'src/common/dto/users.dto';
import { UsersService } from 'src/users/users.service';
import { SigninResDto } from 'src/common/dto/auth.dto';
import { Public } from './public.decorator';
import { OnlineStatusService } from 'src/onlineStatus/onlineStatus.service';

@Controller('auth')
export class AuthController {
  constructor(
    private service: AuthService,
    private readonly usersService: UsersService,
    private readonly onlineStatusService: OnlineStatusService,
  ) {}

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
    await this.onlineStatusService.connect(req.user.userId); // Online状態を更新
    return req.user;
  }

  @Public()
  @Post('42/:code')
  async auth42(@Param() param: Auth42Param): Promise<SigninResDto | string> {
    let token: string;
    try {
      token = await this.service.request42AuthToken(param.code);
      const user42: ftInfo = await this.service.request42Info(token);
      if (user42) {
        Logger.log(`42login => ${user42.login}`);
        Logger.log(`Token => ${token}`);

        const user = await this.usersService.getUserBy42LoginName(user42.login);
        if (user !== null) {
          return await this.service.getSignInRes(user.id, user.name);
        } else {
          // 42ユーザーが登録されていない場合は別のエンドポイントで新規登録
          return token;
        }
      }
    } catch (err) {
      Logger.debug(err);
    }
  }
}
