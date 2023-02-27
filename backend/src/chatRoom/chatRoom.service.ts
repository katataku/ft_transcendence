import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SHA256 } from 'crypto-js';
import { ChatRoom } from 'src/entities/chatRoom.entity';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import {
  ChatRoomAuthReqDto,
  ChatRoomReqDto,
  ChatRoomResDto,
  publicIdType,
} from '../common/dto/chatRoom.dto';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  publicIdType2Number(public_id: publicIdType): number {
    switch (public_id) {
      case 'public':
        return 1;

      case 'private':
        return 2;

      case 'protected':
        return 3;

      case 'DM':
        return 4;
    }
  }

  number2publicIdType(public_id: number): publicIdType {
    switch (public_id) {
      case 1:
        return 'public';
      case 2:
        return 'private';
      case 3:
        return 'protected';
      case 4:
        return 'DM';
    }
  }

  async getList(): Promise<ChatRoomResDto[]> {
    const rows: ChatRoom[] = await this.chatRoomRepository.find({
      select: {
        id: true,
        name: true,
        created_by_user_id: true,
        public_id: true,
      },
      order: {
        id: 'ASC',
      },
    });

    const response: ChatRoomResDto[] = rows.map((item) => {
      return { ...item, public_id: this.number2publicIdType(item.public_id) };
    });
    return response;
  }

  async createRoom(param: ChatRoomReqDto): Promise<ChatRoomResDto> {
    const created_by: User = await this.usersRepository.findOne({
      where: {
        id: param.created_by_user_id,
      },
    });

    const data = new ChatRoom();
    data.name = param.name;
    data.created_by = created_by;
    data.created_by_user_id = param.created_by_user_id;
    data.public_id = this.publicIdType2Number(param.public_id);
    if (param.password) {
      const passHash = SHA256(param.password).toString();
      data.password = passHash;
    }
    const ret = await this.chatRoomRepository.save(data);
    return {
      id: ret.id,
      name: ret.name,
      created_by_user_id: ret.created_by_user_id,
      public_id: this.number2publicIdType(ret.public_id),
    };
  }

  async deleteRoom(id: number): Promise<void> {
    const targetRoom: ChatRoom = await this.chatRoomRepository.findOne({
      where: {
        id: id,
      },
    });
    this.chatRoomRepository.remove(targetRoom);
  }

  async authChatRoom(data: ChatRoomAuthReqDto): Promise<boolean> {
    const row: ChatRoom = await this.chatRoomRepository.findOne({
      select: {
        id: true,
        password: true,
      },
      where: {
        id: data.id,
      },
      order: {
        id: 'ASC',
      },
    });
    if (row.password) {
      const passHash = SHA256(data.password).toString();
      if (row.password === passHash) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
}
