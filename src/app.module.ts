import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import {PassportModule} from '@nestjs/passport'
import {JwtModule} from '@nestjs/jwt'
@Module({
  imports: [
    MongooseModule.forRoot('mongodb://root:example@localhost:27017/db_chats?authSource=admin'),
    AuthModule,
    UsersModule,
    MessagesModule,
    PassportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
