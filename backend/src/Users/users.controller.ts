import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  FriendRequestDto,
  UserCreateReqDto,
  UserCreateResDto,
  UserGetDto,
} from 'src/common/dto/users.dto';

@Controller('user')
export class UsersController {
  constructor(private service: UsersService) {}

  @Post()
  createUser(@Body() body: UserCreateReqDto): Promise<UserCreateResDto> {
    return this.service.create(body);
  }

  @Get(':id')
  getUserById(@Param('id') param: string): Promise<UserGetDto> {
    return this.service.getUserById(Number(param));
  }

  @Post('friends')
  requestFriend(@Body() body: FriendRequestDto) {
    this.service.requestFriendship(body);
  }

  @Get('friends/:id')
  getFriendsById(@Param('id') param: string): Promise<UserGetDto[]> {
    return this.service.getFriendsById(Number(param));
  }

  @Get('friends/pending/:id')
  getPendingFriends(@Param('id') param: string): Promise<UserGetDto[]> {
    Logger.log(param);
    const list = this.service.getPendingFriends(Number(param));
    return list;
  }
}
