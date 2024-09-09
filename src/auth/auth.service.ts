import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { compare } from 'bcryptjs';
import { AuthResponse } from './auth-response/auth-response.interface';
import { LoginAuthDto } from './dto/login-auth.dto';
import { isValidObjectId } from 'mongoose';
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {

    const user = await this.usersService.create(createUserDto);
    const token = this.jwtService.sign({ id: user.id });

    return { user, token };
  }

  async login(loginAuthDto: LoginAuthDto): Promise<AuthResponse> {

    let user: User;

    if (loginAuthDto.emailOrUsername.includes('@')) {
      user = await this.usersService.findByEmail(loginAuthDto.emailOrUsername);
    }

    if (!user && isValidObjectId(loginAuthDto.emailOrUsername)) {
      user = await this.usersService.findById(loginAuthDto.emailOrUsername);
    }

    if (!user) {
      user = await this.usersService.findByUsername(loginAuthDto.emailOrUsername);
    }

    if (!user) throw new UnauthorizedException('Invalid credentials');


    const isPasswordValid = await compare(loginAuthDto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const payload = { id: user.id };
    const token = this.jwtService.sign(payload);

    return { user, token };
  }


}
