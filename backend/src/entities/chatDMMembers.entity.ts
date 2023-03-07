import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { ChatRoom } from './chatRoom.entity';
import { User } from './users.entity';

@Entity()
export class ChatDMMembers {
  @PrimaryColumn()
  user1Id: number;

  @PrimaryColumn()
  user2Id: number;

  @Column({ unique: true })
  chatRoomId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user1: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user2: User;

  @ManyToOne(() => ChatRoom, { onDelete: 'CASCADE' })
  chatRoom: ChatRoom;
}
