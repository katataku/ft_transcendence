import { Controller, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Auth42Param } from 'src/common/params/user.params';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Get('42/:code')
  async auth42(@Param() param: Auth42Param): Promise<string> {
    const token = await this.service.request42AuthToken(param.code);
    return token;
  }
}
