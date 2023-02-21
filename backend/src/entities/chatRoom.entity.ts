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
  readonly id?: number;

  @Column()
  name: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @Column()
  is_public: boolean;

  // DBからIDをselectするためのワークアラウンド
  //https://typeorm.io/relations-faq#how-to-use-relation-id-without-joining-relation
  @Column()
  created_by_user_id: number;
}
