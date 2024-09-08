import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
<<<<<<< HEAD
import { compare } from 'bcryptjs';
import { AuthResponse } from './auth-response/auth-response.interface';
import { UpdateAuthDto } from './dto/update-auth.dto';
=======
import * as bcrypt from 'bcrypt';
import { AuthResponse } from './auth-response/auth-response.interface';
>>>>>>> 967c35c (refact)


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

  async login(username: string, password: string): Promise<any> {
    // Buscar el usuario por nombre de usuario
    const user = await this.usersService.findByUsername(username);
    // Verificar si el usuario existe
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verificar la contraseña
<<<<<<< HEAD
    const isPasswordValid = await compare(password, user.password);
=======
    const isPasswordValid = await bcrypt.compare(password, user.password);
>>>>>>> 967c35c (refact)

    // Si la contraseña es inválida, lanzar excepción
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generar y retornar el JWT
    const payload = { id: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
