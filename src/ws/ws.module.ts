import { Module } from '@nestjs/common';
import { WsService } from './ws.service';
import { WsGateway } from './ws.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { AuthWsGuard } from './guards/auth-ws.guard';

@Module({
  providers: [WsGateway, WsService, AuthWsGuard],
  imports: [AuthModule],
})
export class WsModule { }
