import { Module } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { ChatRoomsController } from './chat-rooms.controller';
import { ChatRoom, ChatRoomSchema } from './entities/chat-room.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [ChatRoomsController],
  providers: [ChatRoomsService],
  imports: [
    MongooseModule.forFeature([
      { name: ChatRoom.name, schema: ChatRoomSchema },
    ])
  ],
})
export class ChatRoomsModule { }
