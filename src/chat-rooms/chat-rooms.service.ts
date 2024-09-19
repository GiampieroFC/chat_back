import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { ChatRoom } from './entities/chat-room.entity';
import { UsersService } from 'src/users/users.service';
import { AddParticipantDto } from './dto/add-participant.dto';
import { User } from 'src/users/entities/user.entity';
import { Role, RoleName } from 'src/roles/entities/role.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: Model<ChatRoom>,
    private readonly usersService: UsersService,
  ) {}

  async findById(id: string) {
    const chatRoom = await this.chatRoomModel.findById(id);
    if (!!chatRoom && !chatRoom.isDeleted) return chatRoom;
    if (!!chatRoom && chatRoom.isDeleted)
      throw new BadRequestException(
        'Talk with an administrator or retry with other params',
      );
    return null;
  }

  async findByName(name: string) {
    const chatRoom = await this.chatRoomModel.findOne({ name });
    if (!!chatRoom && !chatRoom.isDeleted) return chatRoom;
    if (!!chatRoom && chatRoom.isDeleted)
      throw new BadRequestException(
        'Talk with an administrator or retry with other params',
      );
    return null;
  }

  async create(createChatRoomDto: CreateChatRoomDto, user: User) {
    const existsChatRoom = await this.findByName(createChatRoomDto.name);
    if (existsChatRoom)
      throw new BadRequestException('Chat Room already exists');

    // Si se proporcionan miembros, los mantenemos, pero añadimos al creador como 'owner'
    const members = new Map(
      createChatRoomDto.members
        ? Object.entries(createChatRoomDto.members)
        : [],
    );

    // Añadir automáticamente al creador como 'owner'
    members.set(user._id.toString(), RoleName.Owner);

    // Crear el chat room
    const createdChatRoom = new this.chatRoomModel({
      ...createChatRoomDto,
      createdBy: user._id,
      members: members,
    });

    await createdChatRoom.save();
    return createdChatRoom;
  }

  findAll() {
    return this.chatRoomModel.find({ isDeleted: false });
  }

  async findOne(term: string) {
    let chatRoom: ChatRoom;

    if (isValidObjectId(term)) {
      chatRoom = await this.findById(term);
    }

    if (!chatRoom) {
      chatRoom = await this.findByName(term);
    }

    if (!chatRoom)
      throw new BadRequestException('ChatRoom: ${term}, not found');

    return chatRoom;
  }

  async update(term: string, updateChatRoomDto: UpdateChatRoomDto) {
    const chatRoom = await this.findOne(term);
    if (!chatRoom) throw new BadRequestException('Chat Room not found');

    const existsChatRoom = await this.findByName(updateChatRoomDto.name);
    if (existsChatRoom) {
      if (!!existsChatRoom)
        throw new BadRequestException("ChatRoom's name already exists");
    }

    const chatRoomUpdated = await this.chatRoomModel.findByIdAndUpdate(
      chatRoom.id,
      updateChatRoomDto,
      { new: true },
    );
    if (!chatRoomUpdated) throw new BadRequestException('Chat Room not found');

    return chatRoomUpdated;
  }

  async remove(term: string, user: User) {
    // Buscar la sala por ID o nombre
    const chatRoom = await this.findOne(term);
    if (!chatRoom) throw new BadRequestException('Chat Room not found');

    // Verificamos si el usuario es el creador del chat room
    if (chatRoom.createdBy.toString() !== user._id.toString()) {
      throw new BadRequestException(
        'Only the creator can delete the chat room',
      );
    }

    // Marcamos la sala como eliminada
    chatRoom.isDeleted = true;
    await chatRoom.save(); // Guardamos los cambios

    return `Chat room ${term} has been successfully deleted`;
  }

  async addParticipant(addParticipantDto: AddParticipantDto) {
    const { chatRoomId, username } = addParticipantDto;

    // Encuentra el chat room
    const chatRoom = await this.chatRoomModel.findById(chatRoomId);
    if (!chatRoom) throw new NotFoundException('Chat Room not found');

    // Encuentra el usuario por nombre de usuario
    const user = await this.usersService.findOne(username);
    if (!user) throw new NotFoundException('User not found');

    // Verifica si el usuario ya está en el chat room
    if (chatRoom.members.has(user.id)) {
      throw new BadRequestException(
        'User is already a member of this chat room',
      );
    }

    // Agrega el nuevo usuario con el rol 'user'
    chatRoom.members.set(user.id, 'user');
    await chatRoom.save();

    return chatRoom;
  }
  // Método para eliminar un participante del chatroom
  async removeParticipantFromChatRoom(
    chatRoomId: string,
    username: string,
    currentUser: User,
  ): Promise<string> {
    // Buscar la sala de chat
    const chatRoom = await this.chatRoomModel.findById(chatRoomId);
    if (!chatRoom) throw new NotFoundException('Chat Room not found');

    // Verificar que la persona que está haciendo la solicitud es quien creó el chatroom
    if (chatRoom.createdBy.toString() !== currentUser._id.toString()) {
      throw new BadRequestException(
        'Only the creator of the chat room can remove participants',
      );
    }

    // Buscar el usuario que queremos eliminar por su nombre de usuario
    const userToRemove = await this.usersService.findByUsername(username);
    if (!userToRemove) throw new NotFoundException('User not found');

    // Verificar que el usuario a eliminar está en los miembros
    if (!chatRoom.members.has(userToRemove._id.toString())) {
      throw new BadRequestException('User is not a member of the chat room');
    }

    // Eliminar al participante de la sala de chat
    chatRoom.members.delete(userToRemove._id.toString());

    // Guardar los cambios
    await chatRoom.save();

    return `User ${username} has been removed from the chat room`;
  }

  async updateMemberRole(
    chatRoomId: string,
    updateRoleDto: UpdateRoleDto,
    user: User,
  ) {
    const chatRoom = await this.findOne(chatRoomId);
    if (!chatRoom) throw new NotFoundException('Chat Room not found');

    // Validar si el usuario autenticado es el owner del chatroom
    if (chatRoom.members.get(user._id.toString()) !== RoleName.Owner) {
      throw new ForbiddenException('Only the owner can update roles');
    }

    const { userId, newRole } = updateRoleDto;

    // Verificar que el miembro existe en el chatroom
    if (!chatRoom.members.has(userId)) {
      throw new BadRequestException('User is not a member of this chat room');
    }

    // Actualizar el rol
    chatRoom.members.set(userId, newRole);

    await chatRoom.save();
    return `Role of user ${userId} updated to ${newRole}`;
  }
}
