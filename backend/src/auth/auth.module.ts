import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TwoFactorAuthController } from './twoFactorAuth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
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
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
