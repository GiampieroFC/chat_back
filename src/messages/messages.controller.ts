import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  InternalServerErrorException
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Get(':id')
  // aquí ponemos que id es un string porque los id de mongo van a venir como string
  findOne(@Param('id') id: string) {
    // antes aquí de daba error porque id es un string, pero el service recibía un número, por eso cambiamos el tipo de dato en el service también.
    return this.messagesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMessageDto: UpdateMessageDto
  ) {
    try {
      const result = await this.messagesService.update(id, updateMessageDto);
      return result;
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while updating the message');
    }
  }


  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      const result = await this.messagesService.remove(id);
      return { message: result };
    } catch (error) {
      console.error('Error in remove method:', error);
      throw new InternalServerErrorException('An error occurred while deleting the message');
    }
  }
}
