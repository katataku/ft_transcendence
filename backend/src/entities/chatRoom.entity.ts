import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  readonly id?: number;

  @Column()
  name: string;

  @Column()
  created_by: string;

  @Column()
  isPublic: boolean;
}
