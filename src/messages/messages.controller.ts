
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Request } from 'express';


@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  @Auth()
  create(@Body() createMessageDto: CreateMessageDto, @Req() req: Request) {
    return this.messagesService.create(createMessageDto, req);
  }

  @Get()
  findAll() {
    return this.messagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(id);
  }

  @Get('chat-room/:term')
  findAllByChatRoom(@Param('term') term: string) {
    return this.messagesService.findAllByChatRoom(term);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    return this.messagesService.update(id, updateMessageDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.messagesService.remove(id);
    return { message: result };
  }
}
