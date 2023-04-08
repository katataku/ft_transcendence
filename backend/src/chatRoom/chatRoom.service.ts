import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SHA256 } from 'crypto-js';
import { ChatRoom } from 'src/entities/chatRoom.entity';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import {
  ChatRoomAuthReqDto,
  ChatRoomReqDto,
  ChatRoomResDto,
} from '../common/dto/chatRoom.dto';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getList(): Promise<ChatRoomResDto[]> {
    const rows: ChatRoom[] = await this.chatRoomRepository.find({
      select: {
        id: true,
        name: true,
        owner_id: true,
        public_id: true,
      },
      order: {
        id: 'ASC',
      },
    });

    return rows;
  }

  async createRoom(param: ChatRoomReqDto): Promise<ChatRoomResDto> {
    const created_by: User = await this.usersRepository.findOne({
      where: {
        id: param.owner_id,
      },
    });
    if (!created_by) throw new NotFoundException();
    const data = new ChatRoom();
    data.name = param.name;
    data.created_by = created_by;
    data.owner_id = param.owner_id;
    data.public_id = param.public_id;
    if (param.password) {
      const passHash = SHA256(param.password).toString();
      data.password = passHash;
    }
    const ret = await this.chatRoomRepository.save(data);
    return {
      id: ret.id,
      name: ret.name,
      owner_id: ret.owner_id,
      public_id: ret.public_id,
    };
  }

  async updateRoom(id: number, param: ChatRoomReqDto): Promise<ChatRoomResDto> {
    const created_by: User = await this.usersRepository.findOne({
      where: {
        id: param.owner_id,
      },
    });

    const targetRoom: ChatRoom = await this.chatRoomRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!created_by || !targetRoom) throw new NotFoundException();
    targetRoom.name = param.name;
    targetRoom.created_by = created_by;
    targetRoom.owner_id = param.owner_id;
    targetRoom.public_id = param.public_id;
    if (param.password) {
      const passHash = SHA256(param.password).toString();
      targetRoom.password = passHash;
    }
    const ret = await this.chatRoomRepository.save(targetRoom);
    return {
      id: ret.id,
      name: ret.name,
      owner_id: ret.owner_id,
      public_id: ret.public_id,
    };
  }

  async deleteRoom(id: number, signedInUserId: number): Promise<void> {
    const targetRoom: ChatRoom = await this.chatRoomRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!targetRoom) throw new NotFoundException();
    if (signedInUserId != targetRoom.owner_id) throw new ForbiddenException();
    this.chatRoomRepository.remove(targetRoom);
  }

  async authChatRoom(id: number, data: ChatRoomAuthReqDto): Promise<boolean> {
    const row: ChatRoom = await this.chatRoomRepository.findOne({
      select: {
        id: true,
        password: true,
      },
      where: {
        id: id,
      },
      order: {
        id: 'ASC',
      },
    });
    if (!row) throw new NotFoundException();
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

  async updateRoomOwner(id: number, newOwner: { id: number }): Promise<void> {
    const targetRoom: ChatRoom = await this.chatRoomRepository.findOne({
      where: {
        id: id,
      },
    });
    targetRoom.owner_id = newOwner.id;
    this.chatRoomRepository.save(targetRoom);
  }
}
