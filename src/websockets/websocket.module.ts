import { Module } from '@nestjs/common';
import { WebSocketgateway } from './websocket.gateway';

@Module({
  controllers: [],
  providers: [WebSocketgateway],
  imports: [],
})
export class MessagesModule {}
