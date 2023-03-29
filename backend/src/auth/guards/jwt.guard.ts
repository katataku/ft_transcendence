import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../public.decorator';

// https://docs.nestjs.com/security/authentication#enable-authentication-globally
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  // canActivateメソッドはリクエストが特定のエンドポイントにアクセスできるかどうかを判断
  canActivate(context: ExecutionContext) {
    // isPublic変数にエンドポイントがPublicデコレータでマークされているかどうかを代入
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    // エンドポイントがPublicデコレータでマークされている場合、認証をスキップ
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
