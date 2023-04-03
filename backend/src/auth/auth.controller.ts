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
import { Auth42Param, login42Param } from 'src/common/params/user.params';
import { UserGetDto, UserSignInDto } from 'src/common/dto/users.dto';
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
  @Get('42/:code')
  async auth42(@Param() param: Auth42Param): Promise<string> {
    let token: string;
    try {
      token = await this.service.request42AuthToken(param.code);
      const user42: ftInfo = await this.service.request42Info(token);
      if (user42) {
        Logger.log(`42login => ${user42.login}`);
        await this.usersService.createUser({
          name: user42.login,
          password: user42.login,
          avatar: await this.service.getAvatar42(user42.imageLink),
        });
      }
    } catch (err) {
      Logger.debug(err);
    }
    return token;
  }

  @Public()
  @Get('42/login/:token')
  async login42(@Param() param: login42Param): Promise<UserGetDto> {
    try {
      const user42: ftInfo = await this.service.request42Info(param.token);
      return await this.usersService.signInUser({
        name: user42.login,
        password: user42.login,
      });
    } catch (err) {
      Logger.error(err);
    }
  }
}
