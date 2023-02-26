import { Injectable } from '@nestjs/common';
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
    data.isBanned = param.isBanned;
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
}
