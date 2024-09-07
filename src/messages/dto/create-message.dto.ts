import { IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import { MessageType } from "../entities/message.entity";

export class CreateMessageDto {

    @IsMongoId()
    @IsString()
    sender: string;

    @IsMongoId()
    @IsString()
    chatRoom: string;

    @IsString()
    content: string;

    @IsEnum(MessageType, { each: true, message: `messageType must be ${Object.values(MessageType).join(' or ')}` })
    @IsString()
    @IsOptional()
    messageType: MessageType;

    @IsMongoId({ each: true })
    @IsOptional()
    readBy: string[];
}
