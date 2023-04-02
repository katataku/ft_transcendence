import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

interface UserStatus {
  userId: number;
  date: Date;
}

const diffSeconds = 60;

@Injectable()
export class OnlineStatusService {
  private list: Array<UserStatus> = [];

  connect(id: number) {
    const index = this.list.findIndex((user) => {
      return user.userId === id;
    });
    if (index !== -1) {
      this.list[index].date = new Date();
    } else {
      this.list.push({
        userId: id,
        date: new Date(),
      });
      Logger.debug(`${id} is added to Online list.`);
    }
  }

  capture(id: number): boolean {
    const index = this.list.findIndex((user) => {
      return user.userId === id;
    });
    return index !== -1;
  }

  isOnline(id: number): boolean {
    const index = this.list.findIndex((user) => {
      return user.userId === id;
    });
    if (index !== -1) {
      const diff =
      (new Date().getTime() - this.list[index].date.getTime()) / 1000;
      return diff <= diffSeconds;
    }
    return false;
  }

  @Cron('*/5 * * * * *')
  monitor() {
    this.list.map((user, index) => {
      if (!this.isOnline(user.userId)) {
        this.list.splice(index, 1);
        Logger.debug(`ID: ${user.userId} is offline.`);
      }
    });
    this.list.map((user) => {
      Logger.debug(`ID: ${user.userId} has been online since ${user.date}`);
    });
  }
}
