import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ChatBlockUserDto,
  ChatBlockUserPKDto,
} from 'src/common/dto/chatBlockUser.dto';
import { Repository } from 'typeorm';
import { ChatBlockUser } from '../entities/chatBlockUser.entity';

@Injectable()
export class ChatBlockUserService {
  constructor(
    @InjectRepository(ChatBlockUser)
    private chatBlockRepository: Repository<ChatBlockUser>,
  ) {}

  async getList(): Promise<ChatBlockUserDto[]> {
    const rows: ChatBlockUser[] = await this.chatBlockRepository.find();
    return rows;
  }

  async getListOne(blockUserId: number): Promise<ChatBlockUserDto[]> {
    const rows: ChatBlockUser[] = await this.chatBlockRepository.find({
      where: {
        blockUserId: blockUserId,
      },
    });
    return rows;
  }

  async updateBlock(param: ChatBlockUserDto): Promise<ChatBlockUserDto> {
    const data = new ChatBlockUser();
    data.blockUserId = param.blockUserId;
    data.blockedUserId = param.blockedUserId;
    data.block_until = param.block_until;
    const ret = await this.chatBlockRepository.save(data);
    return ret;
  }

  async delete(param: ChatBlockUserPKDto): Promise<void> {
    const targetRecord: ChatBlockUser = await this.chatBlockRepository.findOne({
      where: {
        blockUserId: param.blockUserId,
        blockedUserId: param.blockedUserId,
      },
    });
    this.chatBlockRepository.remove(targetRecord);
  }
}
