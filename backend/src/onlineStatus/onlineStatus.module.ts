import { Module } from '@nestjs/common';
import { OnlineStatusService } from './onlineStatus.service';

@Module({
  imports: [],
  controllers: [],
  providers: [OnlineStatusService],
})
export class OnlineStatusModule {}
