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
    private readonly userService: UsersService,
    private readonly authWsGuard: AuthWsGuard,
    private readonly wsService: WsService
  ) { }

  async handleConnection(client: Socket, ...args: any[]) {
    // console.log('🔗 =>', {
    //   req,
    //   args,
    //   connected: client.connected,
    //   data: client.data,
    //   handshake: client.handshake,
    //   id: client.id,
    //   namespace: client.nsp.name,
    // });

    const user = await this.authWsGuard.getUser(client);
    if (!user) {
      client.disconnect();
      return;
    }

    this.wss.emit('conn', `${user.name} ${user.lastname} se ha conectado!`);
    // this.userService.update(client.data.user.id, {
    //   isConnected: true
    // });

    // this.wss.emit('conn', `${client.data.user.name} ${client.data.user.lastname} se ha conectado!`);
  }

  handleDisconnect(client: Socket) {

    this.userService.update(client.data.user.id, {
      isConnected: true
    });

    this.wss.emit('conn', `${client.data.user.name} ${client.data.user.lastname} se ha conectado!`);
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
