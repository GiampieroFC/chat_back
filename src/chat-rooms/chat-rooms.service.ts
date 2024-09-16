import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { ChatRoom } from './entities/chat-room.entity';
import { UsersService } from 'src/users/users.service';
import { AddParticipantDto } from './dto/add-participant.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChatRoomsService {

  constructor(
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: Model<ChatRoom>,
    private readonly  usersService: UsersService,
  ) { }

  async findById(id: string) {
    const chatRoom = await this.chatRoomModel.findById(id);
    if (!!chatRoom && !chatRoom.isDeleted) return chatRoom;
    if (!!chatRoom && chatRoom.isDeleted) throw new BadRequestException('Talk with an administrator or retry with other params');
    return null;
  }

  async findByName(name: string) {
    const chatRoom = await this.chatRoomModel.findOne({ name });
    if (!!chatRoom && !chatRoom.isDeleted) return chatRoom;
    if (!!chatRoom && chatRoom.isDeleted) throw new BadRequestException('Talk with an administrator or retry with other params');
    return null;
  }

  async create(createChatRoomDto: CreateChatRoomDto, user: User) {
    const existsChatRoom = await this.findByName(createChatRoomDto.name);
    if (existsChatRoom) throw new BadRequestException('Chat Room already exists');
  
    // Crear el chat room
    const createdChatRoom = new this.chatRoomModel({
      ...createChatRoomDto,
      createdBy: user._id,
      members: new Map([[user._id.toString(), 'owner']]) 
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

    if (!chatRoom) throw new BadRequestException('ChatRoom: ${term}, not found');

    return chatRoom;
  }

  async update(term: string, updateChatRoomDto: UpdateChatRoomDto) {

    const chatRoom = await this.findOne(term);
    if (!chatRoom) throw new BadRequestException('Chat Room not found');

    const existsChatRoom = await this.findByName(updateChatRoomDto.name);
    if (existsChatRoom) {
      if (!!existsChatRoom) throw new BadRequestException('ChatRoom\'s name already exists');
    }

    const chatRoomUpdated = await this.chatRoomModel.findByIdAndUpdate(
      chatRoom.id,
      updateChatRoomDto,
      { new: true }
    );
    if (!chatRoomUpdated) throw new BadRequestException('Chat Room not found');

    return chatRoomUpdated;
  }

  async remove(term: string) {

    const chatRoom = await this.findOne(term);
    if (!chatRoom) throw new BadRequestException('Chat Room not found');

    chatRoom.isDeleted = true;
    await chatRoom.save();

    return `This action removes a #${term} chatRoom`;
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
      throw new BadRequestException('User is already a member of this chat room');
    }

    // Agrega el nuevo usuario con el rol 'user'
    chatRoom.members.set(user.id, 'user');
    await chatRoom.save();

    return chatRoom;
  }
}
