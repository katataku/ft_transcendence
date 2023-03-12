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

@Entity({ name: 'friendship' })
export class Friendship {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'user_1' })
  user1!: number;

  @Column({ name: 'user_2' })
  user2!: number;
}

@Entity({ name: 'pending_friendship' })
export class PendingFriendship {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'from' })
  from!: number;

  @Column({ name: 'to' })
  to!: number;
}

@Entity({ name: 'user_avatars' })
export class UserAvatars {
  @PrimaryGeneratedColumn({ name: 'id' })
  id!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ name: 'data' })
  data!: string;
}

@Entity({ name: 'user_match_history' })
export class UserMatchHistory {
  @PrimaryGeneratedColumn({ name: 'id' })
  userId!: number;

  @Column({ name: 'wins' })
  wins!: number;

  @Column({ name: 'losses' })
  losses!: number;
}
