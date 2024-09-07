import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';

@Controller('chat-rooms')
export class ChatRoomsController {
  constructor(private readonly chatRoomsService: ChatRoomsService) { }

  @Post()
  create(@Body() createChatRoomDto: CreateChatRoomDto) {
    return this.chatRoomsService.create(createChatRoomDto);
  }

  @Get()
  findAll() {
    return this.chatRoomsService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.chatRoomsService.findOne(term);
  }

  @Patch(':term')
  update(@Param('term') term: string, @Body() updateChatRoomDto: UpdateChatRoomDto) {
    return this.chatRoomsService.update(term, updateChatRoomDto);
  }

  @Delete(':term')
  remove(@Param('term') term: string) {
    return this.chatRoomsService.remove(term);
  }
}
