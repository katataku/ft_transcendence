import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoom } from 'src/entities/chatRoom.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
  ) {}

  async getList(): Promise<ChatRoom[]> {
    const rows: ChatRoom[] = await this.chatRoomRepository.find({
      order: {
        id: 'ASC',
      },
    });
    return rows;
  }

  async createRoom(param): Promise<ChatRoom> {
    const data = new ChatRoom();
    data.name = param.name;
    data.created_by = param.created_by;
    data.isPublic = param.isPublic;
    return this.chatRoomRepository.save(data);
  }

  async deleteRoom(id: number): Promise<void> {
    const targetRoom: ChatRoom = await this.chatRoomRepository.findOne({
      where: {
        id: id,
      },
    });
    this.chatRoomRepository.remove(targetRoom);
  }
}
