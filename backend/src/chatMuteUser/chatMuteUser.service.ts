import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMuteUser } from '../entity/chatMuteUser.entity';

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
}
