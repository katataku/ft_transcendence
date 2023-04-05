import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import {
  EnableTwoFactorAuthDto,
  VerifyTwoFactorAuthDto,
} from 'src/common/dto/auth.dto';
import { Public } from './public.decorator';

@Controller('auth/2fa')
export class TwoFactorAuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  private logger: Logger = new Logger('TwoFactorAuthController');

  @Get('setup/:userName')
  async getOTPData(
    @Param('userName') userName: string,
  ): Promise<{ secret: string; qrCode: string }> {
    return await this.authService.getOTPData(userName);
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
  async disable(@Body() data: { userId: number }, @Request() req) {
    if (req.user.userId != data.userId) throw new ForbiddenException();
    this.usersService.disableTwoFactor(data.userId);
  }

  @Get('status')
  async isTwoFactorEnabled(@Query('userId') userId: number): Promise<boolean> {
    return await this.usersService.isTwoFactorEnabled(userId);
  }

  @Public()
  @Post('verify')
  async verifyOtp(@Body() data: VerifyTwoFactorAuthDto): Promise<string> {
    return await this.authService.verifyOtp(data);
  }
}
