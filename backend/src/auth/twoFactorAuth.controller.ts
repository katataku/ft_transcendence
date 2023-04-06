import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import {
  EnableTwoFactorAuthDto,
  VerifyTwoFactorAuthDto,
} from 'src/common/dto/auth.dto';
import { Public } from './public.decorator';
import { UserNameParam } from 'src/common/params/user.params';

@Controller('auth/2fa')
export class TwoFactorAuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get('setup/:userName')
  async getOTPData(
    @Param('userName') param: UserNameParam,
  ): Promise<{ secret: string; qrCode: string }> {
    return await this.authService.getOTPData(param.name);
  }

  @Post('enable')
  async enable(
    @Body() data: EnableTwoFactorAuthDto,
    @Request() req,
  ): Promise<boolean> {
    if (req.user.userId != data.userId) throw new ForbiddenException();
    return await this.authService.enable(data);
  }

  @Post('disable')
  async disable(@Request() req) {
    this.usersService.disableTwoFactor(req.user.userId);
  }

  @Get('status')
  async isTwoFactorEnabled(@Request() req): Promise<boolean> {
    return await this.usersService.isTwoFactorEnabled(req.user.userId);
  }

  @Public()
  @Post('verify')
  async verifyOtp(@Body() data: VerifyTwoFactorAuthDto): Promise<string> {
    return await this.authService.verifyOtp(data);
  }
}
