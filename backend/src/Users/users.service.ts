import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  UserCreateReqDto,
  UserCreateResDto,
  UserGetDto,
} from 'src/common/dto/users.dto';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { SHA256 } from 'crypto-js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(data: UserCreateReqDto): Promise<UserCreateResDto> {
    const passHash = SHA256(data.password).toString();
    const obj: User = {
      id: null,
      name: data.name,
      password: passHash,
      createdAt: new Date(),
    };
    const saved = await this.usersRepository.save(obj);
    const res: UserCreateResDto = {
      id: saved.id,
    };
    return res;
  }

  async getById(target: string): Promise<UserGetDto> {
    const id = Number(target);
    if (isNaN(id)) {
      throw new HttpException('Invalid Parameter.', HttpStatus.BAD_REQUEST);
    }
    const data = await this.usersRepository.findOne({ where: { id: id } });
    if (data == null) {
      throw new HttpException('User Not Found.', HttpStatus.NO_CONTENT);
    }

    const res: UserGetDto = {
      id: data.id,
      name: data.name,
    };
    return res;
  }
}
