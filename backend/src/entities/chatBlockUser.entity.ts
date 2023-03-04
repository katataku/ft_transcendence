import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './users.entity';

@Entity({ name: 'chat_block_user' })
export class ChatBlockUser {
  @PrimaryColumn()
  blockUserId: number;

  @PrimaryColumn()
  blockedUserId: number;

  @Column()
  block_until: Date;

  @ManyToOne(() => User)
  blockUser: User;

  @ManyToOne(() => User)
  blockedUser: User;
}
