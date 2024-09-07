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
  ) { }

  async create(createMessageDto: CreateMessageDto) {
    const createdMessage = new this.messageModel(createMessageDto);
    await createdMessage.save();
    return createdMessage;
  }

  async findAll() {
    return this.messageModel.find().exec();
  }

  // aquí ponemos que id es un string porque eso le estamos pasando desde el controlador
  async findOne(id: string) {

    // validamos que el id sea un ObjectId
    if (!isValidObjectId(id)) {
      // tiramos el error de bad request
      throw new BadRequestException(`Invalid message ID: ${id}`);
    }

    // Buscar el mensaje por su ID
    const message = await this.messageModel.findById(id).exec();
    if (!message) {
      // tiramos el error de not found
      throw new BadRequestException(`Message with ID ${id} not found`);
    }

    // retornamos el mensaje si pasa todas las validaciones
    return message;


  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {

    // aquí podemos usar nuestro método anterior de esta misma clase: findOne(), así no tenemos que reescribir las validaciones y ya maneja los errores
    await this.findOne(id); // esto siempre devuelve el recurso, porque si no es un id válido o no existe este método ya maneja los errores

    // aquí ya estamos seguros que existe el recurso, así que podemos actualizarlo
    return this.messageModel.findByIdAndUpdate(id, updateMessageDto, { new: true });
  }


  async remove(id: string) {
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
