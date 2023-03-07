import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ChatDMMembersDto,
  ChatDMMembersPKDto,
} from 'src/common/dto/chatDMMembers.dto';
import { ChatDMMembers } from 'src/entities/chatDMMembers.entity';
import { Repository } from 'typeorm';
import { ChatRoom } from 'src/entities/chatRoom.entity';
import { ChatRoomResDto } from 'src/common/dto/chatRoom.dto';

@Injectable()
export class ChatDMMembersService {
  constructor(
    @InjectRepository(ChatDMMembers)
    private chatDMMembersRepository: Repository<ChatDMMembers>,

    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
  ) {}

  async getDM(user: number): Promise<ChatDMMembersDto[]> {
    const rows: ChatDMMembers[] = await this.chatDMMembersRepository.find({
      where: [
        {
          user1Id: user,
        },
        {
          user2Id: user,
        },
      ],
      order: {
        user1Id: 'ASC',
      },
    });
    return rows;
  }

  async createDMMember(param: ChatDMMembersPKDto): Promise<ChatDMMembersDto> {
    const user1 = Math.min(param.user1Id, param.user2Id);
    const user2 = Math.max(param.user1Id, param.user2Id);

    const findResult: ChatDMMembers =
      await this.chatDMMembersRepository.findOne({
        where: {
          user1Id: user1,
          user2Id: user2,
        },
      });
    if (findResult) {
      return findResult;
    }

    const newDMChatRoom = new ChatRoom();
    newDMChatRoom.public_id = 'DM';
    newDMChatRoom.name = 'DM' + '-' + String(user1) + '-' + String(user2);
    newDMChatRoom.created_by_user_id = user1;
    const newDMresult: ChatRoomResDto = await this.chatRoomRepository.save(
      newDMChatRoom,
    );

    const data = new ChatDMMembers();
    data.user1Id = param.user1Id;
    data.user2Id = param.user2Id;
    data.chatRoomId = newDMresult.id;
    const ret = await this.chatDMMembersRepository.save(data);
    return ret;
  }

  async deleteDMMember(param: ChatDMMembersPKDto): Promise<void> {
    const user1 = Math.min(param.user1Id, param.user2Id);
    const user2 = Math.max(param.user1Id, param.user2Id);

    const targetDMMember: ChatDMMembers =
      await this.chatDMMembersRepository.findOne({
        where: {
          user1Id: user1,
          user2Id: user2,
        },
      });
    this.chatDMMembersRepository.remove(targetDMMember);
  }
}
