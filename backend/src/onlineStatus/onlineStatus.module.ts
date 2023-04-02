import { Module } from '@nestjs/common';
import { OnlineStatusService } from './onlineStatus.service';

@Module({
  providers: [OnlineStatusService],
  exports: [OnlineStatusService],
})
export class OnlineStatusModule {
  static forRoot() {
    return {
      module: OnlineStatusModule,
      providers: [OnlineStatusService],
      exports: [OnlineStatusService],
    };
  }
}
