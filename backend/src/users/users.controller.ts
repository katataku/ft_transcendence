import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  FriendRequestDto,
  UserCreateReqDto,
  UserCreateResDto,
  UserUpdateReqDto,
  UserGetDto,
} from 'src/common/dto/users.dto';
import { UserGetParam } from 'src/common/params/user.params';

@Controller('user')
export class UsersController {
  constructor(private service: UsersService) {}

  @Post()
  createUser(@Body() body: UserCreateReqDto): Promise<UserCreateResDto> {
    return this.service.create(body);
  }

  @Get('users')
  getUsers(): Promise<UserGetDto[]> {
    return this.service.getUsers();
  }

  @Get(':id')
  getUserById(@Param() param: UserGetParam): Promise<UserGetDto> {
    return this.service.getUserById(param.id);
  }

  @Post(':id')
  updateUser(@Body() body: UserUpdateReqDto, @Param() param: UserGetParam): Promise<UserGetDto> {
    return this.service.update(param.id, body)
  }

  @Post('friends')
  requestFriend(@Body() body: FriendRequestDto) {
    this.service.requestFriendship(body);
  }

  @Get('friends/:id')
  getFriendsById(@Param() param: UserGetParam): Promise<UserGetDto[]> {
    return this.service.getFriendsById(param.id);
  }

  @Get('friends/pending/:id')
  getPendingFriends(@Param() param: UserGetParam): Promise<UserGetDto[]> {
    Logger.log(param);
    const list = this.service.getPendingFriends(param.id);
    return list;
  }
}
