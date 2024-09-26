import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
} from '@nestjs/common';
import { ShowContacts, UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ContactSchema } from './entities/user.entity';



@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':term')
  findOne(
    @Param('term') term: string,
  ) {
    return this.usersService.findOne(term);
  }

  @Get(':term/contacts')
  findContacts(
    @Param('term') term: string,
    @Query('show') show: ShowContacts = ShowContacts.LIST,
  ) {
    return this.usersService.findContacts(term, show);
  }

  @Patch(':term')
  update(@Param('term') term: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(term, updateUserDto);
  }

  @Patch(':term/contacts')
  addContact(
    @Param('term') term: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.addContact(term, updateUserDto);
  }

  @Delete(':term')
  remove(@Param('term') term: string) {
    return this.usersService.remove(term);
  }
}
