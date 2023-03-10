import { Injectable } from '@nestjs/common';

interface UserStatus {
  userId: number;
  date: Date;
}

const diffSeconds = 60;

@Injectable()
export class OnlineStatusService {
  private list: UserStatus[];

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
    }
  }

  capture(id: number): boolean {
    const index = this.list.findIndex((user) => {
      return user.userId === id;
    });
    if (index !== -1) {
      const diff =
        (new Date().getTime() - this.list[index].date.getTime()) / 3600000;
      return diff <= diffSeconds;
    }
    return false;
  }
}
