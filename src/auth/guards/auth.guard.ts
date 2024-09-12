import {
  BadGatewayException,
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(

    private readonly jwtService: JwtService,
    private readonly userService: UsersService,

  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException("Invalid token");

    try {
      const payload = this.jwtService.verify(token);
      if (!payload.id) throw new UnauthorizedException("Invalid token");

      const user = await this.userService.findById(payload.id);
      if (!user) throw new BadRequestException("User not found");

      request['user'] = user;
    } catch (error) {

      throw new BadRequestException(error.message);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}