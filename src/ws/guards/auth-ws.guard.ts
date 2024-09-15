import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthWsGuard implements CanActivate {

  @WebSocketServer()
  wss: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService
  ) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const client: Socket = context.switchToWs().getClient();

    try {

      const user = await this.getUser(client);
      client.data.user = user;

      return true;

    } catch (error) {

      console.error("❌ =>", { error });
      client.disconnect();
      return false;
    }
  }

  private extractTokenFromHandshake(client: Socket): string | undefined {
    const [type, token] = client.handshake.auth?.token?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async getUser(client: Socket) {

    let token: string;

    token = this.extractTokenFromHandshake(client);

    if (!token) {
      token = client.handshake.headers?.authorization?.split(' ')[1];

      if (!token) {
        client.emit('error', '❗❗❗ Token not found');
        client.disconnect();
        return;
      }
    }

    try {

      const payload = this.jwtService.verify(token);

      if (!payload.id) {
        client.emit('error', '❗❗❗ Payload not found');
        client.disconnect();
        return;
      }

      const user = await this.userService.findOne(payload.id);

      if (!user) {
        client.emit('error', '❗❗❗ User not found');
        client.disconnect();
        return;
      }

      return user;
    } catch (error) {

      client.emit('error', '❗❗❗' + error.message);
      client.disconnect();
      return;
    }

  }
}