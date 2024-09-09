import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MessagesModule } from './messages/messages.module';

import {PassportModule} from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt';
import { ChatRoomsModule } from './chat-rooms/chat-rooms.module';
import { RolesModule } from './roles/roles.module';
import { WebSocketgateway } from './websockets/websocket.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://root:example@localhost:27017/db_chats?authSource=admin'),
    UsersModule,
    MessagesModule,
    PassportModule,
    ChatRoomsModule,
    RolesModule,
    WebSocketgateway
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
