import { IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import { MessageType } from "../entities/message.entity";
import { formatterArrOr } from "src/auth/utils/formatterArr";


export class CreateMessageDto {

    @IsMongoId()
    @IsString()
    chatRoom: string;

    @IsString()
    content: string;

    @IsEnum(MessageType, { each: true, message: `messageType must be ${formatterArrOr.format(Object.values(MessageType))}` })
    @IsString()
    @IsOptional()
    messageType: MessageType;

    @IsMongoId({ each: true })
    @IsOptional()
    readBy: string[];
}
