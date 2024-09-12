import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.rolesService.findOne(term);
  }

  @Patch(':term')
  update(@Param('term') term: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(term, updateRoleDto);
  }

  @Delete(':term')
  remove(@Param('term') term: string) {
    return this.rolesService.remove(term);
  }
}
