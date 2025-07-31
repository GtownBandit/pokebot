// apps/backend/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  exports: [JwtModule],
  providers: [JwtStrategy],
})
export class AuthModule {}
