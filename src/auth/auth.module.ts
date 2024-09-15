import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from './guards/auth.guard';
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.register({
      secret: 'secret_key',
      signOptions: {
        expiresIn: '2h',
      },
    }),
    UsersModule,
  ],
  exports: [JwtModule, UsersModule],
})
export class AuthModule { }
