import { ChatDMMembers } from 'src/entities/chatDMMembers.entity';
import { Module } from '@nestjs/common';
import { HealthCheckModule } from '../healthCheck';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthCheck } from '../entities/healthCheck.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { ChatModule } from '../chat';
import { ChatBlockUserModule } from '../chatBlockUser';
import * as dotenv from 'dotenv';
import { ChatBlockUser } from '../entities/chatBlockUser.entity';
import { UsersModule } from 'src/users';
import {
  Friendship,
  User,
  PendingFriendship,
  UserAvatars,
  UserMatchHistory,
} from 'src/entities/users.entity';
import { ChatRoom } from 'src/entities/chatRoom.entity';
import { ChatRoomModule } from 'src/chatRoom';
import { ChatRoomMembers } from 'src/entities/chatRoomMembers.entity';
import { ChatRoomMembersModule } from 'src/chatRoomMembers';
import { GameModule } from '../game';
import { Match } from '../entities/match.entity';
import { MatchModule } from '../match';
import { ChatDMMembersModule } from 'src/chatDMMembers';
import { OnlineStatusModule } from 'src/onlineStatus';
import { AuthModule } from 'src/auth';
import { ScheduleModule } from '@nestjs/schedule';

dotenv.config();

const options: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'postgres', //Container name in docker-compose.
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [
    HealthCheck,
    ChatBlockUser,
    User,
    Friendship,
    PendingFriendship,
    UserAvatars,
    UserMatchHistory,
    ChatRoom,
    ChatRoomMembers,
    ChatDMMembers,
    Match,
  ],

  synchronize: true,
};

@Module({
  imports: [
    TypeOrmModule.forRoot(options),
    HealthCheckModule,
    ChatBlockUserModule,
    ChatModule,
    UsersModule,
    ChatRoomModule,
    ChatRoomMembersModule,
    ChatDMMembersModule,
    GameModule,
    MatchModule,
    OnlineStatusModule,
    AuthModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
