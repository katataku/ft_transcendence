import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ChatRoomMembersDto,
  ChatRoomMembersPKDto,
} from 'src/common/dto/chatRoomMembers.dto';
import { ChatRoomMembers } from 'src/entities/chatRoomMembers.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatRoomMembersService {
  constructor(
    @InjectRepository(ChatRoomMembers)
    private chatRoomMembersRepository: Repository<ChatRoomMembers>,
  ) {}

  async getList(): Promise<ChatRoomMembersDto[]> {
    const rows: ChatRoomMembers[] = await this.chatRoomMembersRepository.find({
      order: {
        userId: 'ASC',
      },
    });
    return rows;
  }

  async createRoomMember(
    param: ChatRoomMembersDto,
  ): Promise<ChatRoomMembersDto> {
    const data = new ChatRoomMembers();
    data.chatRoomId = param.chatRoomId;
    data.userId = param.userId;
    data.ban_until = param.ban_until ? param.ban_until : null;
    data.mute_until = param.mute_until ? param.mute_until : null;
    data.isAdministrator = param.isAdministrator;
    const ret = await this.chatRoomMembersRepository.save(data);
    return ret;
  }

  async deleteRoomMember(param: ChatRoomMembersPKDto): Promise<void> {
    const targetRoomMember: ChatRoomMembers =
      await this.chatRoomMembersRepository.findOne({
        where: {
          chatRoomId: param.chatRoomId,
          userId: param.userId,
        },
      });
    this.chatRoomMembersRepository.remove(targetRoomMember);
  }

  async validateUserAdminOfChatRoom(
    signedInUserId: number,
    targetUserId: number,
    chatRoomId: number,
  ): Promise<void> {
    const targetRoomMember: ChatRoomMembers =
      await this.chatRoomMembersRepository.findOne({
        where: {
          chatRoomId: chatRoomId,
          userId: signedInUserId,
        },
      });
    if (signedInUserId === targetUserId) return;
    if (!targetRoomMember || !targetRoomMember.isAdministrator)
      throw new ForbiddenException();
  }
}
