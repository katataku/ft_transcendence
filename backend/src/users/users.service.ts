import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FriendRequestDto,
  UserUpdateReqDto,
  UserGetDto,
  UserSignUpReqDto,
  UserSignUpResDto,
} from 'src/common/dto/users.dto';
import {
  Friendship,
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
  ) {}

  async createUser(data: UserSignUpReqDto): Promise<UserSignUpResDto> {
    const obj: User = {
      id: null,
      name: data.name,
      password: SHA256(data.password).toString(),
      createdAt: new Date(),
    };
    const user = await this.usersRepository.save(obj);
    await this.saveAvatar(user.id, data.avatar);
    const res: UserSignUpResDto = {
      id: user.id,
    };
    return res;
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

  async requestFriendship(data: FriendRequestDto): Promise<void> {
    const pendingList = await this.pendingRepository.find();
    if (
      pendingList.filter(
        (pending) => pending.to == data.to && pending.from == data.from,
      ).length
    ) {
      return;
    }
    pendingList.map((pending) => {
      if (pending.to == data.from && pending.from == data.to) {
        const friendship = new Friendship();
        friendship.user1 = data.from;
        friendship.user2 = data.to;
        this.friendshipRepository.save(friendship);
        this.pendingRepository.remove(pending);
        return;
      }
    });

    const pending = new PendingFriendship();
    pending.from = data.from;
    pending.to = data.to;
    await this.pendingRepository.save(pending);
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
    return (
      await this.userAvatarsRepository.findOne({ where: { userId: userId } })
    ).data;
  }
}
