import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ChatRoomsService } from './chat-rooms.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AddParticipantDto } from './dto/add-participant.dto';
import { RoleName } from 'src/roles/entities/role.entity';
import { User } from 'src/users/entities/user.entity';

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
  
  @UseGuards(AuthGuard)
  @Delete(':term')
  remove(@Param('term') term: string, @Req() req) {
    const user: User = req.user; // Obtenemos el usuario autenticado
    return this.chatRoomsService.remove(term, user);
  }

  @Post('add-participant')
  @UseGuards(AuthGuard)                 // Asegúrate de que el usuario esté autenticado
  async addParticipant(@Body() addParticipantDto: AddParticipantDto) {
    return this.chatRoomsService.addParticipant(addParticipantDto);
  }
  // Endpoint para eliminar a un participante
  @UseGuards(AuthGuard)
  @Delete(':id/participants/:username')
  async removeParticipant(
    @Param('id') chatRoomId: string,
    @Param('username') username: string,
    @Req() req: Request
  ) {
    // El usuario actual lo extraemos del request, esto es posible gracias al AuthGuard
    const currentUser = req['user'] as User;
    
    // Llamamos al servicio para eliminar al participante
    return this.chatRoomsService.removeParticipantFromChatRoom(chatRoomId, username, currentUser);
  }

}
