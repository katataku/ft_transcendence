import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Res,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  FriendRequestDto,
  UserUpdateReqDto,
  UserGetDto,
  UserSignUpReqDto,
  UserSignUpResDto,
  UserSignInDto,
  UserFriendDeleteRequestDto,
} from 'src/common/dto/users.dto';
import { UserIdParam } from 'src/common/params/user.params';
import { Response } from 'express';
import * as fs from 'fs';
import { promisify } from 'util';

@Controller('user')
export class UsersController {
  constructor(private service: UsersService) {}

  @Post()
  signUp(@Body() body: UserSignUpReqDto): Promise<UserSignUpResDto> {
    return this.service.createUser(body);
  }

  @Post('sign_in')
  signIn(@Body() body: UserSignInDto): Promise<UserGetDto> {
    return this.service.signInUser(body);
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
  ): Promise<UserGetDto> {
    return this.service.updateUser(param.id, body);
  }

  @Delete(':id')
  deleteUser(@Param() param: UserIdParam): Promise<string> {
    return this.service.deleteUser(param.id);
  }

  @Delete('friends/:id')
  deleteFriend(
    @Param() param: UserIdParam,
    @Body() body: UserFriendDeleteRequestDto,
  ): Promise<string> {
    return this.service.deleteFriend(param.id, body.friendUserId);
  }

  @Post('friends')
  requestFriend(@Body() body: FriendRequestDto) {
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

  @Delete('friends/pending')
  deleteFriendPending(@Body() body: FriendRequestDto) {
    return this.service.deletePending(body);
  }

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
}
