import { Module } from '@nestjs/common';
import { WsService } from './ws.service';
import { WsGateway } from './ws.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { AuthWsGuard } from './guards/auth-ws.guard';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  providers: [WsGateway, WsService, AuthWsGuard],
  imports: [AuthModule, MessagesModule],
})
export class WsModule { }
