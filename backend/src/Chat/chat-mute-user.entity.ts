import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ChatMuteUser {
  @PrimaryColumn()
  muteUserId: string;

  @PrimaryColumn()
  mutedUserId: string;
}
