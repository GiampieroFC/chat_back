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
import { ChatRoomsService } from './chat-rooms.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Request } from 'express';

@Controller('chat-rooms')
export class ChatRoomsController {
  constructor(private readonly chatRoomsService: ChatRoomsService) { }

  @Post()
  @Auth()
  async createChatRoom(@Body() createChatRoomDto: CreateChatRoomDto, @Req() req: Request) {
    return this.chatRoomsService.create(createChatRoomDto, req);
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
  @Auth()
  update(
    @Param('term') term: string,
    @Body() updateChatRoomDto: UpdateChatRoomDto,
    @Req() req: Request
  ) {
    return this.chatRoomsService.update(term, updateChatRoomDto, req);
  }

  @Delete(':term')
  @Auth()
  remove(@Param('term') term: string, @Req() req: Request) {
    return this.chatRoomsService.remove(term, req);
  }

  @Patch('/:term/members')
  @Auth()
  async addMembers(
    @Param('term') term: string,
    @Body() updateChatRoomDto: UpdateChatRoomDto,
    @Req() req: Request
  ) {
    return this.chatRoomsService.addMembers(term, updateChatRoomDto, req);
  }

  @Delete('/:term/members/:userTerm')
  @Auth()
  async removeMembers(
    @Param('term') term: string,
    @Param('userTerm') userTerm: string,
    @Req() req: Request
  ) {
    return this.chatRoomsService.removeMembers(term, userTerm, req);
  }


  // @UseGuards(AuthGuard)
  // @Patch(':id/update-role')
  // async updateRole(
  //   @Param('id') chatRoomId: string,
  //   @Body() updateRoleDto: UpdateMemberRoleDto,
  //   @Req() req: Request,
  // ) {
  //   // Obtenemos el usuario autenticado del request (AuthGuard)
  //   const currentUser = req['user'] as User;

  //   // Llamamos al servicio para actualizar el rol del participante
  //   return this.chatRoomsService.updateMemberRole(
  //     chatRoomId,
  //     updateRoleDto,
  //     currentUser,
  //   );
  // }
}
