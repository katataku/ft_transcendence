import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'name' })
  name!: string;

  @Column({ name: 'password' })
  password!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}

@Entity({ name: 'friends' })
export class Friends {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'user_1' })
  user1!: number;

  @Column({ name: 'user_2' })
  user2!: number;
}
