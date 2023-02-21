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
  created_by: number;

  @Column()
  is_public: boolean;
}
