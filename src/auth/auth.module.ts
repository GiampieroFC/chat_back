import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
<<<<<<< HEAD
import { Role, RoleSchema } from './entities/role.entity';
import {JwtModule} from '@nestjs/jwt'
import {UsersModule} from '../users/users.module'
=======
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
>>>>>>> 20c6da1787d8603b5d2b6746556a977eb04f318f
@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UsersModule,
    JwtModule.register({
<<<<<<< HEAD
      secret:'secret_key',
      signOptions:{
        expiresIn : '1h'
      }
    }),
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
    ]),
=======
      secret: 'secret_key',
      signOptions: {
        expiresIn: '1h'
      }
    }),
>>>>>>> 20c6da1787d8603b5d2b6746556a977eb04f318f
  ],

})
export class AuthModule { }
