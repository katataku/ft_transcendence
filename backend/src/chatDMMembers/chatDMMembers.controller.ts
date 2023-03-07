import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ChatDMMembersDto,
  ChatDMMembersPKDto,
} from 'src/common/dto/chatDMMembers.dto';
import { ChatDMMembersService } from './chatDMMembers.service';

@Controller('chatDMMembers')
export class ChatDMMembersController {
  constructor(private service: ChatDMMembersService) {}

  @Get(':user')
  getDM(@Param('user') user: number): Promise<ChatDMMembersDto[]> {
    return this.service.getDM(user);
  }

  @Post()
  post(@Body() data: ChatDMMembersPKDto): Promise<ChatDMMembersDto> {
    return this.service.createDMMember(data);
  }

  @Delete()
  delete(@Body() data: ChatDMMembersPKDto): Promise<void> {
    return this.service.deleteDMMember(data);
  }
}
