import { Module } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { ChatRoomsController } from './chat-rooms.controller';
import { ChatRoom, ChatRoomSchema } from './entities/chat-room.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ChatRoomsController],
  providers: [ChatRoomsService, UsersModule],
  imports: [
    MongooseModule.forFeature([
      { name: ChatRoom.name, schema: ChatRoomSchema },
    ]),
    AuthModule,
    UsersModule
  ],
})
export class ChatRoomsModule { }
