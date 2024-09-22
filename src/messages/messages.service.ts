import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { ChatRoomsService } from 'src/chat-rooms/chat-rooms.service';
import { RoleName } from 'src/roles/entities/role.entity';

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatRoomsService: ChatRoomsService,
    private readonly usersService: UsersService,
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
  ) { }

  private async findById(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException(`Invalid message ID: ${id}`);
    return await this.messageModel.findById(id);
  }

  private async isMember(chatRoomId: string, userId: string) {
    const chatRoom = await this.chatRoomsService.findById(chatRoomId);

    console.log("👨🏻‍💻 => ", { isMember: chatRoom.members[userId] });

    if (chatRoom.members[userId])
      return true;
    return false;
  }

  async create(createMessageDto: CreateMessageDto, req: Request) {

    const user = await this.usersService.findOne(req['user']['id']);
    const chatRoom = await this.chatRoomsService.findOne(createMessageDto.chatRoom);

    if (!await this.isMember(chatRoom.id, user.id))
      throw new BadRequestException('You are not a member of this chat room');

    const createdMessage = new this.messageModel(createMessageDto);
    createdMessage.sender = user.id;
    createdMessage.chatRoom = chatRoom.id;
    createdMessage.readBy = [user.id];
    await createdMessage.save();

    return createdMessage;
  }

  async findAll() {
    return this.messageModel.find();
  }

  async findOne(id: string) {

    const message = await this.findById(id);
    if (!message) throw new BadRequestException(`Message with ID ${id} not found`);

    return message;
  }

  async findAllByChatRoom(term: string) {

    const chatRoom = await this.chatRoomsService.findOne(term);

    return this.messageModel.find({ chatRoom: chatRoom.id });
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {

    await this.findOne(id);

    return this.messageModel.findByIdAndUpdate(id, updateMessageDto, { new: true });
  }

  async remove(id: string) {

    await this.findOne(id);

    return this.messageModel.findByIdAndDelete(id);
  }
}
