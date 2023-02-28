import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ChatRoomService } from './chatRoom.service';
import {
  ChatRoomAuthReqDto,
  ChatRoomReqDto,
  ChatRoomResDto,
} from '../common/dto/chatRoom.dto';
import { ChatRoomMembersDto } from 'src/common/dto/chatRoomMembers.dto';
import { ChatRoomMembersService } from 'src/chatRoomMembers/chatRoomMembers.service';

@Controller('chatRoom')
export class ChatRoomController {
  constructor(
    private service: ChatRoomService,
    private chatRoomMembersService: ChatRoomMembersService,
  ) {}

  @Get()
  get(): Promise<ChatRoomResDto[]> {
    return this.service.getList();
  }

  @Post()
  async post(@Body() data: ChatRoomReqDto): Promise<ChatRoomResDto> {
    const result = await this.service.createRoom(data);
    if (result) {
      const chatRoomMembers = new ChatRoomMembersDto();
      chatRoomMembers.chatRoomId = result.id;
      chatRoomMembers.userId = data.created_by_user_id;
      chatRoomMembers.ban_until = undefined;
      chatRoomMembers.mute_until = undefined;
      chatRoomMembers.isAdministrator = true;
      this.chatRoomMembersService.createRoomMember(chatRoomMembers);
    }

    return result;
  }

  @Post(':id')
  async update(
    @Param('id') id: number,
    @Body() data: ChatRoomReqDto,
  ): Promise<ChatRoomResDto> {
    const result = await this.service.updateRoom(id, data);
    if (result) {
      const chatRoomMembers = new ChatRoomMembersDto();
      chatRoomMembers.chatRoomId = result.id;
      chatRoomMembers.userId = data.created_by_user_id;
      chatRoomMembers.ban_until = undefined;
      chatRoomMembers.mute_until = undefined;
      chatRoomMembers.isAdministrator = true;
      this.chatRoomMembersService.createRoomMember(chatRoomMembers);
    }
    return result;
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.deleteRoom(id);
  }

  @Post('auth')
  async authChatRoom(@Body() data: ChatRoomAuthReqDto): Promise<void> {
    const result = await this.service.authChatRoom(data);
    if (!result)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return;
  }
}
