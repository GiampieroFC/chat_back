import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<any> {
    const user = await this.usersService.findByEmail(createUserDto.email);
    if (user) {
      throw new UnauthorizedException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.jwtService.sign({ id: newUser.id, email: newUser.email });
  }

  async login(username: string, password: string): Promise<any> {
    // Buscar el usuario por nombre de usuario
    const user = await this.usersService.findByUsername(username);
    console.log(user)
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
  }

}
