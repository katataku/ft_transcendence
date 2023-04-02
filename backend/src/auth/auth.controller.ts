import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
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
  async auth42(@Param() param: Auth42Param): Promise<SigninResDto> {
    let token: string;
    try {
      token = await this.service.request42AuthToken(param.code);
      const user42 = await this.service.request42Info(token);
      if (user42) {
        Logger.log(`42login => ${user42.login}`);
        Logger.log(`Token => ${token}`);

        let signedInUserId: number;
        const user = await this.usersService.getUserByName(user42.login);
        if (user !== null) {
          // すでにユーザーが存在する場合
          if (user.is42User === false)
            throw new HttpException(
              '42userではないユーザーが同じ名前を使っています',
              HttpStatus.BAD_REQUEST,
            );
          signedInUserId = user.id;
        } else {
          // ユーザーを作成して情報を返す
          signedInUserId = (
            await this.usersService.createUser({
              name: user42.login,
              password: '',
              avatar: await this.service.getAvatar42(user42.image.link),
              is42User: true,
            })
          ).id;
        }
        const SigninRes = this.service.getSignInRes(
          signedInUserId,
          user42.login,
        );
        Logger.log(SigninRes);
        return SigninRes;
      }
    } catch (err) {
      Logger.debug(err);
    }
  }
}
