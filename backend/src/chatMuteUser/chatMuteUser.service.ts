import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ChatMuteUserDto,
  ChatMuteUserPKDto,
} from 'src/common/dto/chatMuteUser.dto';
import { Repository } from 'typeorm';
import { ChatMuteUser } from '../entities/chatMuteUser.entity';

@Injectable()
export class ChatMuteUserService {
  constructor(
    @InjectRepository(ChatMuteUser)
    private chatMuteRepository: Repository<ChatMuteUser>,
  ) {}

  async getList(): Promise<ChatMuteUserDto[]> {
    const rows: ChatMuteUser[] = await this.chatMuteRepository.find();
    return rows;
  }

  async getListOne(muteUserId: number): Promise<ChatMuteUserDto[]> {
    const rows: ChatMuteUser[] = await this.chatMuteRepository.find({
      where: {
        muteUserId: muteUserId,
      },
    });
    return rows;
  }

  async updateMute(param: ChatMuteUserDto): Promise<ChatMuteUserDto> {
    const data = new ChatMuteUser();
    data.muteUserId = param.muteUserId;
    data.mutedUserId = param.mutedUserId;
    data.mute_until = param.mute_until;
    const ret = await this.chatMuteRepository.save(data);
    return ret;
  }

  async delete(param: ChatMuteUserPKDto): Promise<void> {
    const targetRecord: ChatMuteUser = await this.chatMuteRepository.findOne({
      where: {
        muteUserId: param.muteUserId,
        mutedUserId: param.mutedUserId,
      },
    });
    this.chatMuteRepository.remove(targetRecord);
  }
}
