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
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const message = await this.messagesService.findOne(id);
      return message;
    } catch (error) {
      console.error('Error in findOne method:', error);
      throw new InternalServerErrorException('An error occurred while retrieving the message');
    }
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
