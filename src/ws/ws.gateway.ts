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
import { Body, Req, UseGuards } from '@nestjs/common';
import { AuthWsGuard } from './guards/auth-ws.guard';
import { UsersService } from 'src/users/users.service';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { MessagesService } from 'src/messages/messages.service';
import { Request } from 'express';
import { ChatRoom } from 'src/chat-rooms/entities/chat-room.entity';

@WebSocketGateway({ cors: true })
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  wss: Server;

  constructor(
    private readonly authWsGuard: AuthWsGuard,
    private readonly messagesService: MessagesService,
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
  async handleTest(@ConnectedSocket() client: Socket, @MessageBody() createMessageDto: string, @Req() req: Request) {


    try {

      const { chatRoom, content, ...rest } = JSON.parse(createMessageDto);
      console.log("👨🏻‍💻 =>", { rest: !!Object.keys(rest).length, final: (!chatRoom && !content && !!Object.keys(rest).length) });

      if ((!chatRoom && !content) || !!Object.keys(rest).length) {
        client.emit('message', '❗❗❗ only "chatRoom" and "content" are required');
        return;
      }

      const msgBodyObj = new CreateMessageDto();
      msgBodyObj.chatRoom = chatRoom;
      msgBodyObj.content = content;

      const msg = await this.messagesService.create(msgBodyObj, req);

      this.wss.emit('message', msg);
    } catch (error) {

      client.emit('message', error.message);
    }
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
