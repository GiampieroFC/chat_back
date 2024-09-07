import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role, RoleSchema } from './entities/role.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
    ])
  ],
})
export class RolesModule { }
