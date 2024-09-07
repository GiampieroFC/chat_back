import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const createdMessage = new this.messageModel(createMessageDto);
    await createdMessage.save();
    return createdMessage;
  }

  async findAll() {
    return this.messageModel.find().exec();
  }

  async findOne(id: number) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid message ID: ${id}`);
    }
    const message = await this.messageModel.findById(id).exec();
    if (!message) {
      throw new BadRequestException(`Message with ID ${id} not found`);
    }
    return message;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    try {
      // Verificar si el id es un ObjectId válido
      if (!Types.ObjectId.isValid(id)) {
        throw new NotFoundException('Invalid message ID');
      }

      // Log the received parameters
      console.log('Updating message with ID:', id);
      console.log('Update data:', updateMessageDto);

      const updatedMessage = await this.messageModel.findByIdAndUpdate(id, updateMessageDto, { new: true });
      
      // Log the result
      console.log('Updated message:', updatedMessage);

      if (!updatedMessage) {
        throw new NotFoundException('Message not found');
      }

      return updatedMessage;
    } catch (error) {
      // Log the error details
      console.error('Error updating message:', error);
      throw new InternalServerErrorException('An error occurred while updating the message');
    }
  }


  async remove(id: number) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Invalid message ID: ${id}`);
    }
    const deletedMessage = await this.messageModel.findByIdAndDelete(id).exec();
    if (!deletedMessage) {
      throw new BadRequestException(`Message with ID ${id} not found`);
    }
    return `Message with ID ${id} has been removed`;
  }
}
