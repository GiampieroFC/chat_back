import { ChatRoomType } from "../entities/chat-room.entity";
import { IsOptional, IsString, MinLength, IsEnum, IsMongoId, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { RoleName } from "src/roles/entities/role.entity";

export class ChatRoomMemberDto {
    @IsMongoId()
    @IsString()
    user: string;

    @IsEnum(RoleName, { message: 'role must be one of the values: ' + Object.values(RoleName).join(', ') })
    @IsOptional()
    @IsString()
    role: RoleName;
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
