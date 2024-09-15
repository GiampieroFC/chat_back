import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { WsService } from './ws.service';
import { CreateWsDto } from './dto/create-ws.dto';
import { UpdateWsDto } from './dto/update-ws.dto';
import { UseGuards } from '@nestjs/common';
import { AuthWsGuard } from './guards/auth-ws.guard';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({ cors: true })
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  wss: Server;

  constructor(
    private readonly authWsGuard: AuthWsGuard,
    private readonly wsService: WsService
  ) { }

  async handleConnection(client: Socket, ...args: any[]) {

    const user = await this.authWsGuard.getUser(client);
    if (!user) {
      client.disconnect();
      return;
    }
    await user.updateOne({ isConnected: true });

    client.broadcast.emit('conn', `🔗 ${user.username} se ha conectado!`);

  }

  async handleDisconnect(client: Socket) {

    const user = await this.authWsGuard.getUser(client);
    console.log("👨🏻‍💻 =>", { user });

    await user.updateOne({ isConnected: false });

    client.broadcast.emit('disconn', `🚫 ${user.username} se ha conectado!`);
  }

  // ---

  @UseGuards(AuthWsGuard)
  @SubscribeMessage('test')
  handleTest(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
    console.log(data);
    console.log({ user: client.data.user });
    this.wss.emit('message', data);
  }

  @SubscribeMessage('createW')
  create(@MessageBody() createWDto: CreateWsDto) {
    return this.wsService.create(createWDto);
  }

  @SubscribeMessage('findAllWs')
  findAll() {
    return this.wsService.findAll();
  }

  @SubscribeMessage('findOneW')
  findOne(@MessageBody() id: number) {
    return this.wsService.findOne(id);
  }

  @SubscribeMessage('updateW')
  update(@MessageBody() updateWDto: UpdateWsDto) {
    return this.wsService.update(updateWDto.id, updateWDto);
  }

  @SubscribeMessage('removeW')
  remove(@MessageBody() id: number) {
    return this.wsService.remove(id);
  }
}
