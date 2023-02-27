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
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  // DBからIDをselectするためのワークアラウンド
  //https://typeorm.io/relations-faq#how-to-use-relation-id-without-joining-relation
  @Column()
  created_by_user_id: number;

  // チャットルームの種別
  // Postgresではstringとして保存される。
  @Column()
  public_id: publicIdType;

  @Column({ nullable: true })
  password: string;
}
