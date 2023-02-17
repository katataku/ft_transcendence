import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './users.entity';

@Entity({ name: 'chat_mute_user' })
export class ChatMuteUser {
  @PrimaryColumn()
  muteUserId: number;

  @PrimaryColumn()
  mutedUserId: number;

  @Column()
  mute_until: Date;

  @ManyToOne(() => User)
  muteUser: User;

  @ManyToOne(() => User)
  mutedUser: User;
}
