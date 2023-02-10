import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'chat_mute_user' })
export class ChatMuteUser {
  @PrimaryColumn()
  muteUserId: string;

  @PrimaryColumn()
  mutedUserId: string;
}
