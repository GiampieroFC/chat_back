import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message, MessageSchema } from './entities/message.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { ChatRoomsModule } from 'src/chat-rooms/chat-rooms.module';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
    ]),
    AuthModule,
    ChatRoomsModule
  ],
  exports: [MessagesService]
})
export class MessagesModule { }
