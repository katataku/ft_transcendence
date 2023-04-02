import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TwoFactorAuthController } from './twoFactorAuth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt.guard';
import { OnlineStatusModule } from 'src/onlineStatus';

@Module({
  imports: [
    UsersModule,
    OnlineStatusModule.forRoot(),
    JwtModule.registerAsync({
      /*
        useFactoryは動的に生成する。
        useFactoryがなかった場合、process.env.JWT_SECRET_KEYはundefinedになる。
      */
      useFactory: () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController, TwoFactorAuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AuthModule {}
