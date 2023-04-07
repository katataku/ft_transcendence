import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Res,
  Put,
  HttpException,
  HttpStatus,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  FriendRequestDto,
  UserUpdateReqDto,
  UserGetDto,
  UserSignUpReqDto,
  UserSignUpResDto,
  UserFriendDeleteRequestDto,
  UserMatchHistoryDto,
  UsernameCheckResponseDto,
  UsernameCheckRequestDto,
  UserAvatarUpdateReqDto,
} from 'src/common/dto/users.dto';
import { UserIdParam } from 'src/common/params/user.params';
import { Response } from 'express';
import * as fs from 'fs';
import { promisify } from 'util';
import { Public } from 'src/auth/public.decorator';
import { User42SignUpReqDto } from 'src/common/dto/users.dto';

@Controller('user')
export class UsersController {
  constructor(private service: UsersService) {}

  @Public()
  @Post()
  signUp(@Body() body: UserSignUpReqDto): Promise<UserSignUpResDto> {
    return this.service.createUser(body);
  }

  @Public()
  @Post('42')
  ftSignUp(@Body() body: User42SignUpReqDto): Promise<string> {
    return this.service.create42User(body);
  }

  @Get('users')
  getUsers(): Promise<UserGetDto[]> {
    return this.service.getUsers();
  }

  @Get(':id')
  getUserById(@Param() param: UserIdParam): Promise<UserGetDto> {
    return this.service.getUserById(param.id);
  }

  @Put(':id')
  updateUser(
    @Param() param: UserIdParam,
    @Body() body: UserUpdateReqDto,
    @Request() req,
  ): Promise<string> {
    if (req.user.userId != param.id) throw new ForbiddenException();
    return this.service.updateUser(param.id, body);
  }

  @Delete(':id')
  deleteUser(@Param() param: UserIdParam, @Request() req): Promise<string> {
    if (req.user.userId != param.id) throw new ForbiddenException();
    return this.service.deleteUser(param.id);
  }

  @Delete('friends/:id')
  deleteFriend(
    @Param() param: UserIdParam,
    @Body() body: UserFriendDeleteRequestDto,
    @Request() req,
  ): Promise<string> {
    if (req.user.userId != param.id) throw new ForbiddenException();
    return this.service.deleteFriend(param.id, body.friendUserId);
  }

  @Post('friends')
  requestFriend(@Body() body: FriendRequestDto, @Request() req) {
    if (req.user.userId != body.from) throw new ForbiddenException();
    console.table(body);
    return this.service.requestFriendship(body);
  }

  @Get('friends/:id')
  getFriendsById(@Param() param: UserIdParam): Promise<UserGetDto[]> {
    return this.service.getFriendsById(param.id);
  }

  @Get('friends/pending/:id')
  getPendingFriends(@Param() param: UserIdParam): Promise<UserGetDto[]> {
    const list = this.service.getPendingFriends(param.id);
    return list;
  }

  @Delete('friends/pending/:from/:to')
  deleteFriendPending(
    @Param('from') from: UserIdParam,
    @Param('to') to: UserIdParam,
    @Request() req,
  ) {
    // フレンド申請を拒否する時と自らキャンセルする時にaccessされるのでfromとtoを検証している
    if (req.user.userId != from && req.user.userId != to)
      throw new ForbiddenException();
    return this.service.deletePending(from.id, to.id);
  }

  @Public()
  @Get('user_avatar/:id')
  async getAvatar(
    @Param() param: UserIdParam,
    @Res() res: Response,
  ): Promise<void> {
    res.setHeader('Content-Type', 'image/png');
    const base64Data: string = await this.service.getAvatarById(param.id);
    if (base64Data == 'DEFAULT_AVATAR') {
      const readFile = promisify(fs.readFile);
      const buffer = await readFile(`${process.cwd()}/image/defaultAvatar.png`);
      res.send(buffer);
      return;
    }

    const binaryData = Buffer.from(
      base64Data.replace(/^data:image\/png;base64,/, ''),
      'base64',
    );
    res.send(binaryData);
  }

  @Put('user_avatar/:id')
  async updateAvatar(
    @Param() param: UserIdParam,
    @Body() body: UserAvatarUpdateReqDto,
  ): Promise<void> {
    return await this.service.updateAvatar(param.id, body.avatar);
  }

  @Get('match_history/:id')
  async getUserMatchHistory(
    @Param() param: UserIdParam,
  ): Promise<UserMatchHistoryDto> {
    return await this.service.getUserMatchHistory(param.id);
  }

  @Public()
  @Post('check/username-availability')
  async checkUsername(
    @Body() body: UsernameCheckRequestDto,
  ): Promise<UsernameCheckResponseDto> {
    const isDuplicate = await this.service.isUsernameDuplicate(body.username);

    if (isDuplicate) {
      throw new HttpException(
        'Username already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    return { message: 'Username is available' };
  }
}
