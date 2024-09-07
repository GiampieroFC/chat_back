import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum RoleName {
    Admin = 'admin',
    Owner = 'owner',
    Moderator = 'moderator',
    User = 'user',
}

@Schema({ timestamps: true })
export class Role extends Document {
    @Prop({
        enum: RoleName,
        required: true,
        unique: true
    })
    name: RoleName;

    @Prop({ type: String })
    description: string;

    @Prop({ default: false })
    isDeleted: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

// indexa el campo name
RoleSchema.index({ name: 1 });