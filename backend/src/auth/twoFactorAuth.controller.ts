import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import {
  EnableTwoFactorAuthDto,
  VerifyTwoFactorAuthDto,
} from 'src/common/dto/auth.dto';

@Controller('auth/2fa')
export class TwoFactorAuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  private logger: Logger = new Logger('TwoFactorAuthController');

  @Get('setup/:userId')
  async getOTPData(
    @Param('userId') userId: number,
  ): Promise<{ secret: string; qrCode: string }> {
    const secret = this.authService.generateSecret();
    const qrCode = await this.authService.generateQrCode(
      secret,
      userId.toString(),
    );
    return {
      secret: secret,
      qrCode: qrCode,
    };
  }

  @Post('enable')
  async enable(@Body() data: EnableTwoFactorAuthDto) {
    const isValid = this.authService.verifyToken(data.secret, data.token);
    if (isValid) {
      await this.usersService.enableTwoFactor(data.userId, data.secret);
      return 'Logged in successfully';
    } else {
      return 'Invalid token';
    }
  }

  @Post('disable')
  async disable(@Body() data: { userId: number }) {
    this.usersService.disableTwoFactor(data.userId);
  }

  @Get('status')
  async isTwoFactorEnabled(@Query('userId') userId: number): Promise<boolean> {
    return await this.usersService.isTwoFactorEnabled(userId);
  }

  @Post('verify')
  async verifyOtp(@Body() data: VerifyTwoFactorAuthDto): Promise<boolean> {
    const secret = await this.usersService.getOTPSecret(data.userId);
    if (secret === null) {
      return false;
    }

    const isValid = this.authService.verifyToken(secret, data.token);
    if (isValid) {
      this.logger.log('2fa Logged in successfully');
    } else {
      this.logger.log('2fa Invalid token');
    }
    return isValid;
  }
}
