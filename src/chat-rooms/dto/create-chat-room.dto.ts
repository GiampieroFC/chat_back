import { ChatRoomType } from "../entities/chat-room.entity";
import { IsOptional, IsString, MinLength, IsEnum, IsMongoId, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class ChatRoomMemberDto {
    @IsMongoId()
    @IsString()
    user: string;

    @IsMongoId()
    @IsString()
    role: string;
}

export class CreateChatRoomDto {

    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    @MinLength(6)
    @IsOptional()
    description?: string;

    @IsString()
    @IsEnum(ChatRoomType)
    chatRoomtype: ChatRoomType;

    @IsMongoId()
    @IsString()
    createdBy: string;

    @ValidateNested({ each: true })
    @Type(() => ChatRoomMemberDto)
    members: ChatRoomMemberDto[];

    @IsString()
    @MinLength(4)
    @IsOptional()
    password?: string;
}
