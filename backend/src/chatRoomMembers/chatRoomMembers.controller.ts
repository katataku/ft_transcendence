import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Post,
  Request,
} from '@nestjs/common';
import {
  ChatRoomMembersDto,
  ChatRoomMembersPKDto,
} from 'src/common/dto/chatRoomMembers.dto';
import { ChatRoomMembersService } from './chatRoomMembers.service';

@Controller('chatRoomMembers')
export class ChatRoomMembersController {
  constructor(private service: ChatRoomMembersService) {}

  @Get()
  get(): Promise<ChatRoomMembersDto[]> {
    return this.service.getList();
  }

  @Post()
  async post(
    @Body() data: ChatRoomMembersDto,
    @Request() req,
  ): Promise<ChatRoomMembersDto> {
    await this.service.validateUserAdminOfChatRoom(
      req.user.userId,
      data.userId,
      data.chatRoomId,
    );
    return this.service.createRoomMember(data);
  }

  @Delete()
  async delete(
    @Body() data: ChatRoomMembersPKDto,
    @Request() req,
  ): Promise<void> {
    await this.service.validateUserAdminOfChatRoom(
      req.user.userId,
      data.userId,
      data.chatRoomId,
    );
    return this.service.deleteRoomMember(data);
  }
}
