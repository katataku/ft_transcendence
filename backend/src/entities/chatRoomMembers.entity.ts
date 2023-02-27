import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { ChatRoom } from './chatRoom.entity';
import { User } from './users.entity';

@Entity()
export class ChatRoomMembers {
  @PrimaryColumn()
  chatRoomId: number;

  @PrimaryColumn()
  userId: number;

  @Column({ nullable: true })
  ban_until?: Date;

  @Column()
  isAdministrator: boolean;

  @ManyToOne(() => ChatRoom, { onDelete: 'CASCADE' })
  chatRoom: ChatRoom;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
