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
  post(
    @Body() data: ChatDMMembersPKDto,
    @Request() req,
  ): Promise<ChatDMMembersDto> {
    if (req.user.userId != data.user1Id) throw new ForbiddenException();
    return this.service.createDMMember(data);
  }

  @Delete()
  delete(@Body() data: ChatDMMembersPKDto, @Request() req): Promise<void> {
    if (req.user.userId != data.user1Id) throw new ForbiddenException();
    return this.service.deleteDMMember(data);
  }
}
