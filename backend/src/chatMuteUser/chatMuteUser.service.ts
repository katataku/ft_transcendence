import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMuteUser } from '../entities/chatMuteUser.entity';

@Injectable()
export class ChatMuteUserService {
  constructor(
    @InjectRepository(ChatMuteUser)
    private chatMuteRepository: Repository<ChatMuteUser>,
  ) {}

  async getList(): Promise<ChatMuteUser[]> {
    const rows: ChatMuteUser[] = await this.chatMuteRepository.find();
    return rows;
  }

  async getListOne(muteUserId: string): Promise<ChatMuteUser[]> {
    const rows: ChatMuteUser[] = await this.chatMuteRepository.find({
      where: {
        muteUserId: muteUserId,
      },
    });
    return rows;
  }

  async updateMute(param): Promise<ChatMuteUser> {
    const data = new ChatMuteUser();
    data.muteUserId = param.muteUserId;
    data.mutedUserId = param.mutedUserId;
    data.mute_until = param.mute_until;
    const ret = await this.chatMuteRepository.save(data);
    return ret;
  }

  async delete(param): Promise<void> {
    const targetRecord: ChatMuteUser = await this.chatMuteRepository.findOne({
      where: {
        muteUserId: param.muteUserId,
        mutedUserId: param.mutedUserId,
      },
    });
    this.chatMuteRepository.remove(targetRecord);
  }
}
