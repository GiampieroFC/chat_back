import { PartialType } from '@nestjs/mapped-types';
import { CreateChatRoomDto } from './create-chat-room.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateChatRoomDto extends PartialType(CreateChatRoomDto) {

    @IsOptional()
    @IsBoolean()
    isDeleted?: boolean;

}
