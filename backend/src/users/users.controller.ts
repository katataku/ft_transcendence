import { Body, Controller, Get, Logger, Param, Post, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  FriendRequestDto,
  UserCreateReqDto,
  UserCreateResDto,
  UserUpdateReqDto,
  UserGetDto,
} from 'src/common/dto/users.dto';
import { UserIdParam } from 'src/common/params/user.params';

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
  getUserById(@Param() param: UserIdParam): Promise<UserGetDto> {
    return this.service.getUserById(param.id);
  }

  @Post(':id')
  updateUser(@Body() body: UserUpdateReqDto, @Param() param: UserIdParam): Promise<UserGetDto> {
    return this.service.updateUser(param.id, body)
  }

  @Delete(':id')
  deleteUser(@Param() param: UserIdParam): Promise<string> {
    return this.service.deleteUser(param.id)
  }

  @Post('friends')
  requestFriend(@Body() body: FriendRequestDto) {
    this.service.requestFriendship(body);
  }

  @Get('friends/:id')
  getFriendsById(@Param() param: UserIdParam): Promise<UserGetDto[]> {
    return this.service.getFriendsById(param.id);
  }

  @Get('friends/pending/:id')
  getPendingFriends(@Param() param: UserIdParam): Promise<UserGetDto[]> {
    Logger.log(param);
    const list = this.service.getPendingFriends(param.id);
    return list;
  }
}
