import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { hashSync } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {

  constructor(

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

  ) { }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async create(createUserDto: CreateUserDto) {

    const existsUser = await this.findByEmail(createUserDto.email);

    if (existsUser) throw new BadRequestException('User already registed');

    const user = new this.userModel(createUserDto);

    user.password = hashSync(createUserDto.password);

    await user.save();

    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
