import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FriendRequestDto,
  UserUpdateReqDto,
  UserGetDto,
  UserSignUpReqDto,
  UserSignUpResDto,
  UserSignInDto,
  UserMatchHistoryDto,
} from 'src/common/dto/users.dto';
import {
  Friendship,
  UserMatchHistory,
  PendingFriendship,
  User,
  UserAvatars,
} from '../entities/users.entity';
import { Repository } from 'typeorm';
import { SHA256 } from 'crypto-js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
    @InjectRepository(PendingFriendship)
    private pendingRepository: Repository<PendingFriendship>,
    @InjectRepository(UserAvatars)
    private userAvatarsRepository: Repository<UserAvatars>,
    @InjectRepository(UserMatchHistory)
    private userMatchHistoryRepository: Repository<UserMatchHistory>,
  ) {
    this.saveAvatar(0, 'DEFAULT_AVATAR');
  }

  async createUser(data: UserSignUpReqDto): Promise<UserSignUpResDto> {
    if (await this.usersRepository.findOne({ where: { name: data.name } })) {
      throw new Error('Name already in use.'); //42authの初期認証を判定
    }
    const obj: User = {
      id: null,
      name: data.name,
      password: SHA256(data.password).toString(),
      createdAt: new Date(),
      isTwoFactorEnabled: false,
    };
    const user = await this.usersRepository.save(obj);
    await this.saveAvatar(user.id, data.avatar);
    await this.saveUserMatchHistory(user.id);
    const res: UserSignUpResDto = {
      id: user.id,
    };
    return res;
  }

  async signInUser(data: UserSignInDto): Promise<UserGetDto> {
    const target = await this.usersRepository.findOne({
      where: { name: data.name },
    });

    if (target == null) {
      throw new HttpException('User Not Found.', HttpStatus.NOT_FOUND);
    }

    if (SHA256(data.password).toString() !== target.password) {
      throw new HttpException(
        'Password is incorrect.',
        HttpStatus.UNAUTHORIZED,
      );
    } else {
      return {
        id: target.id,
        name: target.name,
        isTwoFactorEnabled: target.isTwoFactorEnabled,
        otpSecret: target.otpSecret,
      };
    }
  }

  async getUsers(): Promise<UserGetDto[]> {
    const users = await this.usersRepository.find();
    const res: UserGetDto[] = [];
    for (let i = 0; i < users.length; ++i) {
      res.push(await this.getUserById(users[i].id));
    }
    return res;
  }

  async getUserById(id: number): Promise<UserGetDto> {
    const data = await this.usersRepository.findOne({ where: { id: id } });
    if (data == null) {
      throw new HttpException('User Not Found.', HttpStatus.NOT_FOUND);
    }

    const res: UserGetDto = {
      id: data.id,
      name: data.name,
      isTwoFactorEnabled: data.isTwoFactorEnabled,
      otpSecret: data.otpSecret,
    };
    return res;
  }

  async updateUser(id: number, data: UserUpdateReqDto): Promise<UserGetDto> {
    const target = await this.usersRepository.findOne({ where: { id: id } });
    if (target == null) {
      throw new HttpException('User Not Found.', HttpStatus.NOT_FOUND);
    }
    target.name = data.name;
    target.password = SHA256(data.password).toString();
    await this.usersRepository.save(target);
    return this.getUserById(id);
  }

  async deleteUser(id: number): Promise<string> {
    const target = await this.usersRepository.findOne({ where: { id: id } });
    if (target == null) {
      throw new HttpException('User Not Found.', HttpStatus.NOT_FOUND);
    }
    return this.usersRepository.remove(target) ? 'OK' : '...';
  }

  async deleteFriend(id: number, friendId: number): Promise<string> {
    const user1 = Math.min(id, friendId);
    const user2 = Math.max(id, friendId);
    const target = await this.friendshipRepository.findOne({
      where: {
        user1: user1,
        user2: user2,
      },
    });
    if (target == null) {
      throw new HttpException('User Not Found.', HttpStatus.NOT_FOUND);
    }
    return this.friendshipRepository.remove(target) ? 'OK' : '...';
  }

  async requestFriendship(data: FriendRequestDto): Promise<void> {
    const pendingList = await this.pendingRepository.find();
    if (
      pendingList.filter(
        (pending) => pending.to == data.to && pending.from == data.from,
      ).length
    ) {
      return;
    }

    if (
      pendingList.some(
        (pending) => pending.to == data.from && pending.from == data.to,
      )
    ) {
      pendingList.map((pending) => {
        if (pending.to == data.from && pending.from == data.to) {
          const user1 = Math.min(data.from, data.to);
          const user2 = Math.max(data.from, data.to);
          const friendship = new Friendship();
          friendship.user1 = user1;
          friendship.user2 = user2;
          this.friendshipRepository.save(friendship);
          this.pendingRepository.remove(pending);
        }
      });
    } else {
      const pending = new PendingFriendship();
      pending.from = data.from;
      pending.to = data.to;
      await this.pendingRepository.save(pending);
    }
  }

  async deletePending(from: number, to: number): Promise<void> {
    const pendingItem = await this.pendingRepository.findOne({
      where: {
        from: from,
        to: to,
      },
    });

    this.pendingRepository.remove(pendingItem);
  }

  async getPendingFriends(id: number): Promise<UserGetDto[]> {
    const pendingList = await this.pendingRepository.find();
    const res: UserGetDto[] = [];
    const pendings = pendingList.filter((pending) => pending.to == id);
    for (let i = 0; i < pendings.length; ++i) {
      res.push(await this.getUserById(pendings[i].from));
    }
    return res;
  }

  async getFriendsById(id: number): Promise<UserGetDto[]> {
    const user = await this.getUserById(id);
    const friendships: Friendship[] = await this.friendshipRepository.find();
    const res: UserGetDto[] = [];
    for (let i = 0; i < friendships.length; ++i) {
      if (friendships[i].user1 == user.id) {
        res.push(await this.getUserById(friendships[i].user2));
      } else if (friendships[i].user2 == user.id) {
        res.push(await this.getUserById(friendships[i].user1));
      }
    }
    return res;
  }

  async saveAvatar(userId: number, data: string): Promise<number> {
    const obj: UserAvatars = {
      id: null,
      userId: userId,
      data: data,
    };
    return (await this.userAvatarsRepository.save(obj)).id;
  }

  async getAvatarById(userId: number): Promise<string> {
    const res = await this.userAvatarsRepository.findOne({
      where: { userId: userId },
    });
    if (!res) {
      throw new HttpException('Avatar Not Found.', HttpStatus.NOT_FOUND);
    }
    return res.data;
  }

  async saveUserMatchHistory(userId: number): Promise<void> {
    await this.userMatchHistoryRepository.save({
      userId: userId,
      wins: 0,
      losses: 0,
    });
  }

  async getUserMatchHistoryRow(userId: number): Promise<UserMatchHistory> {
    return await this.userMatchHistoryRepository.findOne({
      where: { userId: userId },
    });
  }

  async getUserMatchHistory(userId: number): Promise<UserMatchHistoryDto> {
    const data = await this.getUserMatchHistoryRow(userId);
    return { wins: data.wins, losses: data.losses };
  }

  async updateUserMatchHistory(userId: number, type: string): Promise<void> {
    const data: UserMatchHistory = await this.getUserMatchHistoryRow(userId);
    data[type] = data[type] + 1;
    await this.userMatchHistoryRepository.save(data);
  }

  async isUsernameDuplicate(username: string): Promise<boolean> {
    const data = await this.usersRepository.findOne({
      where: { name: username },
    });
    return data != null;
  }

  async getOTPSecret(userId: number): Promise<string> {
    const user = await this.getUserById(userId);
    if (user.otpSecret == null) {
      throw new HttpException('2FA by otp is invalid .', HttpStatus.NOT_FOUND);
    }
    return user.otpSecret;
  }

  async enableTwoFactor(userId: number, otpSecret: string): Promise<User> {
    const user = await this.getUserById(userId);
    user.isTwoFactorEnabled = true;
    user.otpSecret = otpSecret;
    const updatedUser = await this.usersRepository.save(user);
    return updatedUser;
  }

  async disableTwoFactor(userId: number): Promise<User> {
    const user = await this.getUserById(userId);
    user.isTwoFactorEnabled = false;
    user.otpSecret = null;
    const updatedUser = await this.usersRepository.save(user);
    return updatedUser;
  }

  async isTwoFactorEnabled(userId: number): Promise<boolean> {
    const user = await this.getUserById(userId);
    return user.isTwoFactorEnabled;
  }
}
