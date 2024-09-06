import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {

  constructor(

    @InjectModel(Role.name)
    private readonly roleModel: Model<Role>

  ) { }

  async findById(id: string) {
    const role = await this.roleModel.findById(id);
    if (!!role && !role.isDeleted) return role;
    if (!!role && role.isDeleted) throw new BadRequestException('Talk with an administrator or try with other params');
    return null;
  }

  async findByName(name: string) {
    const role = await this.roleModel.findOne({ name });
    if (!!role && !role.isDeleted) return role;
    if (!!role && role.isDeleted) throw new BadRequestException('Talk with an administrator or try with other params');
    return null;
  }

  async create(createRoleDto: CreateRoleDto) {

    const existsRole = await this.findByName(createRoleDto.name);
    if (existsRole) throw new BadRequestException('Role already exists');

    const role = new this.roleModel(createRoleDto);
    role.save();

    return role;
  }

  findAll() {
    return this.roleModel.find({ isDeleted: false });
  }

  async findOne(term: string) {

    let role: Role;

    if (!!term.trim() && typeof term === 'string') {
      role = await this.findByName(term);
    }

    if (!role && isValidObjectId(term)) {
      role = await this.findById(term);
    }

    if (!role) throw new BadRequestException(`Role ${term} not found`);

    return role;
  }

  async update(term: string, updateRoleDto: UpdateRoleDto) {

    const role = await this.findOne(term);
    if (!role) throw new BadRequestException('Role not found');

    const existsNameRole = await this.findByName(updateRoleDto.name);
    if (existsNameRole) throw new BadRequestException('Name role already exists');

    const roleUpdated = await this.roleModel.findByIdAndUpdate(role.id, updateRoleDto, { new: true });

    return roleUpdated;
  }

  async remove(term: string) {

    await this.update(term, { isDeleted: true });
    return `This action removes a #${term} role`;
  }
}
