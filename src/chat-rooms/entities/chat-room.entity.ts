import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { Role, RoleName } from "src/roles/entities/role.entity";
import { User } from "src/users/entities/user.entity";

const ObjectId = MongooseSchema.Types.ObjectId;

export enum ChatRoomType {
    Public = 'public',
    Private = 'private'
}

@Schema({ timestamps: true, })
export class ChatRoom extends Document {

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ trim: true })
    description?: string;

    @Prop({
        type: String,
        enum: ChatRoomType,
        default: ChatRoomType.Private
    })
    chatRoomtype: string;

    @Prop({
        type: ObjectId,
        ref: User.name,
        required: true
    })
    createdBy: string;

    @Prop([{
        user: {
            type: ObjectId,
            ref: User.name,
            required: true,
        },
        role: {
            type: String,
            enum: RoleName,
            required: true,
        }
    }])
    members: Array<{
        user: string;
        role: RoleName;
    }>;

    @Prop()
    password?: string;

    @Prop({ default: false })
    isDeleted: boolean;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);

// Agregar índices para mejorar el rendimiento de las consultas
ChatRoomSchema.index({ name: 1 });
ChatRoomSchema.index({ 'members.user': 1 });
// ChatRoomSchema.index({ 'members.role': 1 });