import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { ChatBlockUserService } from './chatBlockUser.service';
import {
  ChatBlockUserDto,
  ChatBlockUserPKDto,
} from 'src/common/dto/chatBlockUser.dto';
import { UserIdParam } from 'src/common/params/user.params';

@Controller('chat-block-user')
export class ChatBlockUserController {
  constructor(private service: ChatBlockUserService) {}

  @Get()
  get(): Promise<ChatBlockUserDto[]> {
    return this.service.getList();
  }

  @Get(':blockUser')
  getOne(
    @Param('blockUser') blockUser: UserIdParam,
  ): Promise<ChatBlockUserDto[]> {
    return this.service.getListOne(blockUser.id);
  }

  @Post()
  post(
    @Body() data: ChatBlockUserDto,
    @Request() req,
  ): Promise<ChatBlockUserDto> {
    if (req.user.userId != data.blockUserId) throw new ForbiddenException();
    return this.service.updateBlock(data);
  }

  @Delete()
  delete(@Body() data: ChatBlockUserPKDto, @Request() req): Promise<void> {
    if (req.user.userId != data.blockUserId) throw new ForbiddenException();
    return this.service.delete(data);
  }
}
