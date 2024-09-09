import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from 'src/roles/entities/role.entity';
import {JwtModule} from '@nestjs/jwt'
import {UsersModule} from '../users/users.module'
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    JwtModule.register({
      secret:'secret_key',
      signOptions:{
        expiresIn : '1h'
      }
    }),
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
    ]),
  ],

})
export class AuthModule { }
