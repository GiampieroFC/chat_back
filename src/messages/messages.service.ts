import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
  ) { }

  async create(createMessageDto: CreateMessageDto) {

    const createdMessage = new this.messageModel(createMessageDto);
    await createdMessage.save();

    return createdMessage;
  }

  async findAll() {
    return this.messageModel.find().exec();
  }

  async findOne(id: string) {

    if (!isValidObjectId(id)) throw new BadRequestException(`Invalid message ID: ${id}`);
    const message = await this.messageModel.findById(id);

    if (!message) throw new BadRequestException(`Message with ID ${id} not found`);

    return message;
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {

    await this.findOne(id);

    return this.messageModel
      .findByIdAndUpdate(id, updateMessageDto, { new: true });
  }

  async remove(id: string) {

    await this.findOne(id);

    return this.messageModel.findByIdAndDelete(id);
  }
}
