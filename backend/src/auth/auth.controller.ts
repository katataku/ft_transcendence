import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth42Param } from 'src/common/params/user.params';
import { UserSignInDto } from 'src/common/dto/users.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UsersService } from 'src/users/users.service';
import { SigninResDto } from 'src/common/dto/auth.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private service: AuthService,
    private readonly usersService: UsersService,
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
    return req.user;
  }

  @Public()
  @Get('42/:code')
  async auth42(@Param() param: Auth42Param): Promise<string> {
    const token = await this.service.request42AuthToken(param.code);
    const user42 = await this.service.request42Info(token);
    Logger.log(`42login => ${user42.login}`);

    try {
      await this.usersService.createUser({
        name: user42.login,
        password: user42.login,
        avatar: await this.service.getAvatar42(user42.image.link),
      });
    } catch (err) {
      Logger.log(err);
    }
    return token;
  }
}
