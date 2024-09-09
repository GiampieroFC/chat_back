import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { Message, MessageSchema } from './entities/message.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
    ])
  ],
})
<<<<<<< HEAD
export class MessagesModule { }
=======
export class MessagesModule { }
>>>>>>> origin/jazzback
