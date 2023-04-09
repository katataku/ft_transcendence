import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Request,
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
  async post(
    @Body() data: ChatRoomReqDto,
    @Request() req,
  ): Promise<ChatRoomResDto> {
    if (req.user.userId != data.created_by_user_id)
      throw new ForbiddenException();
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
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ChatRoomReqDto,
    @Request() req,
  ): Promise<ChatRoomResDto> {
    if (req.user.userId != data.created_by_user_id)
      throw new ForbiddenException();
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
  delete(@Param('id', ParseIntPipe) id: number, @Request() req): Promise<void> {
    return this.service.deleteRoom(id, req.user.userId);
  }

  @Post(':id/auth')
  async authChatRoom(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ChatRoomAuthReqDto,
  ): Promise<void> {
    console.log('authChatRoom');
    console.table(data);
    const result = await this.service.authChatRoom(id, data);
    if (!result)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    return;
  }
}
