import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { UpdateChatRoomDto } from './dto/update-chat-room.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { ChatRoom } from './entities/chat-room.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { RoleName } from 'src/roles/entities/role.entity';
import { Request } from 'express';


@Injectable()
export class ChatRoomsService {

  constructor(
    @InjectModel(ChatRoom.name)
    private readonly chatRoomModel: Model<ChatRoom>,
    private readonly usersService: UsersService,
  ) { }

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

  private checkMembers(members: Record<string, RoleName>, userId: string) {

    delete members[userId];

    const membersKeys = Object.keys(members);
    const membersValues = Object.values(members);

    if (membersKeys.length !== membersValues.length)
      throw new BadRequestException('Members must have a unique key');

    if (membersKeys.length !== new Set(membersKeys).size)
      throw new BadRequestException('Members must have a unique key');

    if (membersValues.includes(RoleName.Owner))
      throw new BadRequestException('"owner" cannot be added as a member');

    const cleanMembers = {
      ...members,
      [userId]: RoleName.Owner
    };

    return cleanMembers;
  }

  async create(createChatRoomDto: CreateChatRoomDto, req: Request) {

    const { id: userId }: User = req['user'];

    const existsChatRoom = await this.findByName(createChatRoomDto.name);
    if (existsChatRoom) throw new BadRequestException('Chat Room with that name already exists');

    const members = this.checkMembers(createChatRoomDto.members, userId);

    const newChatRoomData = {
      ...createChatRoomDto,
      createdBy: userId,
      members,
    };

    const createdChatRoom = new this.chatRoomModel(newChatRoomData);
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
      throw new BadRequestException(`ChatRoom: ${term}, not found`);

    return chatRoom;
  }

  async update(term: string, updateChatRoomDto: UpdateChatRoomDto, req: Request) {

    const user: User = req['user'];
    const chatRoom = await this.findOne(term);

    const existsNameChatRoom = await this.findByName(updateChatRoomDto.name);
    if (!!existsNameChatRoom)
      throw new BadRequestException("ChatRoom's name already exists");

    if (chatRoom.members[user.id] !== RoleName.Owner)
      throw new BadRequestException('Only the "owner" can update the chat room');

    const members = this.checkMembers(updateChatRoomDto.members, user.id);

    const chatRoomUpdated = await this.chatRoomModel.findByIdAndUpdate(
      chatRoom.id,
      { ...updateChatRoomDto, members },
      { new: true },
    );
    if (!chatRoomUpdated) throw new InternalServerErrorException('Can\'t update chat room - Talk with an administrator');

    return chatRoomUpdated;
  }

  async remove(term: string, req: Request) {
    return this.update(term, { isDeleted: true }, req);
  }

  async addMembers(term: string, updateChatRoomDto: UpdateChatRoomDto, req: Request) {

    const user: User = req['user'];
    const chatRoom = await this.findOne(term);
    const { members, ...rest } = updateChatRoomDto;

    if (!!Object.keys(rest).length || !members) throw new BadRequestException('This endpoint only accepts "members"');

    const checkedMembers = this.checkMembers({ ...chatRoom.members, ...members }, user.id);

    return this.update(term, { members: checkedMembers }, req);
  }

  async removeMembers(term: string, userTerm: string, req: Request) {

    const chatRoom = await this.findOne(term);
    delete chatRoom.members[userTerm];

    return this.update(term, { members: chatRoom.members }, req);
  }
}
