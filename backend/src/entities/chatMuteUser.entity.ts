import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'chat_mute_user' })
export class ChatMuteUser {
  //TODO(takkatao): ユーザプロフィールとの連携が取れ次第、ユーザIDに変更する。現状はname(string)を使用。
  @PrimaryColumn()
  muteUserId: string;

  //TODO(takkatao): ユーザプロフィールとの連携が取れ次第、ユーザIDに変更する。現状はname(string)を使用。
  @PrimaryColumn()
  mutedUserId: string;

  @Column()
  mute_until: Date;
}
