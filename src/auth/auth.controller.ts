import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthGuard } from './guards/auth.guard';
import { Request } from 'express';
import { Auth } from './decorators/auth.decorator';
import { RoleName } from 'src/roles/entities/role.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Get('public')
  public() {
    return 'public';
  }

  @Get('private')
  @Auth(RoleName.Moderator, RoleName.Owner)
  private(@Req() req: Request) {
    return req['user'];
  }
}
