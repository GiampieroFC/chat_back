import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { isValidObjectId, Model, Types } from 'mongoose';
import { hashSync } from 'bcryptjs';

import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

export enum ShowContacts {
  FULL = 'full',
  LIST = 'list',
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) { }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (user && !user.isDeleted) return user;
    return null;
  }
  async findByUsername(username: string) {
    const user = await this.userModel.findOne({ username });
    if (user && !user.isDeleted) return user;
    return null;
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (user && !user.isDeleted) return user;
    return null;
  }

  async create(createUserDto: CreateUserDto) {
    let existsUser: User;
    createUserDto.password = hashSync(createUserDto.password);

    existsUser = await this.findByEmail(createUserDto.email);
    if (existsUser) throw new BadRequestException('Email already registed');

    existsUser = await this.findByUsername(createUserDto.username);
    if (existsUser) throw new BadRequestException('Username already registed');

    const user = new this.userModel(createUserDto);
    await user.save();

    return user;
  }

  findAll() {
    return this.userModel.find({ isDeleted: false });
  }

  async findOne(term: string) {
    let user: User;

    if (term.includes('@')) {
      user = await this.findByEmail(term);
    }

    if (!user && isValidObjectId(term)) {
      user = await this.findById(term);
    }

    if (!user) {
      user = await this.findByUsername(term);
    }

    if (!user) throw new BadRequestException(`User with ${term} not found`);

    return user;
  }
  async findContacts(term: string, contacts: ShowContacts) {
    const user = await this.findOne(term);

    if (contacts === ShowContacts.LIST) {
      return Object.keys(user.contacts);
    }

    if (contacts === ShowContacts.FULL) {

      const contactsList = Object.keys(user.contacts).map(key => new ObjectId(key));

      const foundContacts = await this.userModel.find({ _id: { $in: contactsList } });


      return foundContacts;
    }

    return new InternalServerErrorException('Check logs - Talk with an administrator');
  }

  async addContact(term: string, updateUserDto: UpdateUserDto) {

    const user = await this.findOne(term);

    const newContacts = { ...user.contacts, ...updateUserDto.contacts };

    const updatedUser = await this.update(user.id, { contacts: newContacts });

    return updatedUser;
  }

  async update(term: string, updateUserDto: UpdateUserDto) {
    const existsEmail = await this.findByEmail(updateUserDto.email);
    if (existsEmail) throw new BadRequestException('Email already registed');

    const existsUsername = await this.findByUsername(updateUserDto.username);
    if (existsUsername)
      throw new BadRequestException('Username already registed');

    const user = await this.findOne(term);

    if (!!updateUserDto.password) {
      updateUserDto.password = hashSync(updateUserDto.password);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      user.id,
      updateUserDto,
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async remove(term: string) {
    const user = await this.findOne(term);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.update(user.id, { isDeleted: true });

    return `This action removes a #${term} user`;
  }

  async removeContact(term: string, id: string) {

    const user = await this.findOne(term);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    delete user.contacts[id];

    const updatedUser = await this.update(user.id, { contacts: user.contacts });

    return updatedUser;
  }
}
