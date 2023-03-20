import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TwoFactorAuthController } from './twoFactorAuth.controller';

@Module({
  imports: [UsersModule],
  controllers: [AuthController, TwoFactorAuthController],
  providers: [AuthService],
})
export class AuthModule {}
