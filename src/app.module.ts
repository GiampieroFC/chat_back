import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MessagesModule } from './messages/messages.module';
<<<<<<< HEAD
import {PassportModule} from '@nestjs/passport'
import {JwtModule} from '@nestjs/jwt'
=======
import { JwtModule } from '@nestjs/jwt';
import { ChatRoomsModule } from './chat-rooms/chat-rooms.module';
import { RolesModule } from './roles/roles.module';
>>>>>>> 20c6da1787d8603b5d2b6746556a977eb04f318f
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://root:example@localhost:27017/db_chats?authSource=admin'),
    UsersModule,
    MessagesModule,
<<<<<<< HEAD
    PassportModule,
=======
    ChatRoomsModule,
    RolesModule,
>>>>>>> 20c6da1787d8603b5d2b6746556a977eb04f318f
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
