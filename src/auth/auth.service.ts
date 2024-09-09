<<<<<<< HEAD
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthResponse } from './auth-response/auth-response.interface';
=======
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { compare } from 'bcryptjs';
import { AuthResponse } from './auth-response/auth-response.interface';
import { LoginAuthDto } from './dto/login-auth.dto';
>>>>>>> 20c6da1787d8603b5d2b6746556a977eb04f318f


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

<<<<<<< HEAD
  async login(username: string, password: string): Promise<any> {
    // Buscar el usuario por nombre de usuario
    const user = await this.usersService.findByUsername(username);
    // Verificar si el usuario existe
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Si la contraseña es inválida, lanzar excepción
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generar y retornar el JWT
    const payload = { id: user.id, username: user.username };
    return this.jwtService.sign(payload);
=======
  async login(loginAuthDto: LoginAuthDto): Promise<AuthResponse> {

    const user = await this.usersService.findByEmail(loginAuthDto.emailOrUsername);
    if (!user) throw new BadRequestException('Invalid credentials');

    const isPasswordValid = await compare(loginAuthDto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    const payload = { id: user.id };
    const token = this.jwtService.sign(payload);

    return { user, token };
>>>>>>> 20c6da1787d8603b5d2b6746556a977eb04f318f
  }

}
