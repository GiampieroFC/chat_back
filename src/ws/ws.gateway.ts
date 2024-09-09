import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { WsService } from './ws.service';
import { CreateWsDto } from './dto/create-ws.dto';
import { UpdateWsDto } from './dto/update-ws.dto';

@WebSocketGateway({ cors: true })
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  wss: Server;

  constructor(
    private readonly wsService: WsService
  ) { }

  handleConnection(client: Socket, ...args: any[]) {
    console.log("🔗 =>", {
      args,
      connected: client.connected,
      data: client.data,
      handshake: client.handshake,
      id: client.id,
      namespace: client.nsp.name,
    });
    // console.log("🔗 =>", { client, args });

    this.wss.emit('message', 'world');

  }

  handleDisconnect(client: Socket) {
    console.log("🚫 =>", {});

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
