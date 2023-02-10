import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserCreateReqDto,
  UserCreateResDto,
  UserGetDto,
} from 'src/common/dto/users.dto';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(data: UserCreateReqDto): Promise<UserCreateResDto> {
    const obj = new User();
    Logger.log('aa');
    obj.name = data.name;
    obj.password = data.password;
    obj.createdAt = new Date();
    const saved = await this.usersRepository.save(obj);
    const res: UserCreateResDto = {
      id: saved.id,
    };
    return res;
  }

  async getById(target: number): Promise<UserGetDto> {
    const data = await this.usersRepository.findOne({ where: { id: target } });
    if (data == null) {
      throw new HttpException('User Not Found.', HttpStatus.NOT_FOUND);
    }

    const res: UserGetDto = {
      id: data.id,
      name: data.name,
    };
    return res;
  }
}
