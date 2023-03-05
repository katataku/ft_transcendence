import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  FriendRequestDto,
  UserUpdateReqDto,
  UserGetDto,
  UserSignUpReqDto,
  UserSignUpResDto,
  UserSignInDto,
} from 'src/common/dto/users.dto';
import { UserIdParam } from 'src/common/params/user.params';
import { Response } from 'express';

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

  @Post(':id')
  updateUser(
    @Body() body: UserUpdateReqDto,
    @Param() param: UserIdParam,
  ): Promise<UserGetDto> {
    return this.service.updateUser(param.id, body);
  }

  @Delete(':id')
  deleteUser(@Param() param: UserIdParam): Promise<string> {
    return this.service.deleteUser(param.id);
  }

  @Post('friends')
  requestFriend(@Body() body: FriendRequestDto) {
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

  @Get('user_avatar/:id')
  async getAvatar(@Param() param: UserIdParam, @Res() res: Response): Promise<void> {
    const base64Data: string = await this.service.getAvatarById(param.id);
    const binaryData = Buffer.from(base64Data.replace(/^data:image\/png;base64,/, ''), 'base64');

    res.setHeader('Content-Type', 'image/png');
    res.send(binaryData);
  }
}
