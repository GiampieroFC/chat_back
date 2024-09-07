import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ChatRoom } from "src/chat-rooms/entities/chat-room.entity";
import { User } from "src/users/entities/user.entity";

const ObjectId = MongooseSchema.Types.ObjectId;

export enum MessageType {
    Text = 'text',
    Image = 'image',
    File = 'file'
}

@Schema({ timestamps: true })
export class Message extends Document {

    @Prop({
        type: ObjectId,
        ref: User.name,
        required: true
    })
    sender: string;

    @Prop({
        type: ObjectId,
        ref: ChatRoom.name,
        required: true
    })
    chatRoom: string;

    @Prop({ required: true })
    content: string;

    @Prop({
        enum: MessageType,
        default: MessageType.Text
    })
    messageType: string;

    @Prop({
        type: [{
            type: ObjectId,
            ref: User.name
        }]
    })
    readBy: string[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);