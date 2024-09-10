import {
    ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class WebSocketgateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Cliente conectado ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }
  @SubscribeMessage('mensaje')
  handlemessage(@ConnectedSocket() client:Socket ,@MessageBody() data: any) {
    console.log(data);
    // this.server.emit('mensajeserver', data)
    client.broadcast.emit('mensajeserver',data)
  }
}
