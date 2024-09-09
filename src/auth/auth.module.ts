import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './entities/role.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
    ])
  ],
})
export class AuthModule { }
