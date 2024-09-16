import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AddParticipantDto } from './dto/add-participant.dto';
import { RoleName } from 'src/roles/entities/role.entity';

@Controller('chat-rooms')
export class ChatRoomsController {
  constructor(private readonly chatRoomsService: ChatRoomsService) { }

  @Auth(RoleName.User)
  @Post()
  async createChatRoom(@Body() createChatRoomDto: CreateChatRoomDto, @Req() request: any) {
    const user = request.user;
    return this.chatRoomsService.create(createChatRoomDto, user);
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
  @Post('add-participant')
  @UseGuards(AuthGuard)                 // Asegúrate de que el usuario esté autenticado
  async addParticipant(@Body() addParticipantDto: AddParticipantDto) {
    return this.chatRoomsService.addParticipant(addParticipantDto);
  }
}
