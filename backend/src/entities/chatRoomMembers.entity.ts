import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { ChatRoom } from './chatRoom.entity';
import { User } from './users.entity';

@Entity()
export class ChatRoomMembers {
  @PrimaryColumn()
  chatRoomId: number;

  @PrimaryColumn()
  userId: number;

  @Column()
  isBanned: boolean;

  @ManyToOne(() => ChatRoom)
  chatRoom: ChatRoom;

  @ManyToOne(() => User)
  user: User;
}
