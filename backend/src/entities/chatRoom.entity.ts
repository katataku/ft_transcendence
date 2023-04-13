import { publicIdType } from 'src/common/dto/chatRoom.dto';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  name: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner' })
  owner: User;

  // DBからIDをselectするためのワークアラウンド
  //https://typeorm.io/relations-faq#how-to-use-relation-id-without-joining-relation
  @Column()
  owner_id: number;

  // チャットルームの種別
  // Postgresではstringとして保存される。
  @Column()
  public_id: publicIdType;

  @Column({ nullable: true })
  password: string;
}
