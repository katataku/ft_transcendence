import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
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
  post(@Body() data: ChatRoomMembersDto): Promise<ChatRoomMembersDto> {
    return this.service.createRoomMember(data);
  }

  @Delete()
  delete(@Body() data: ChatRoomMembersPKDto): Promise<void> {
    return this.service.deleteRoomMember(data);
  }
}
