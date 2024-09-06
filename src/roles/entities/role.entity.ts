import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Role extends Document {
    @Prop({
        type: String,
        required: true,
        unique: true
    })
    name: string;

    @Prop({ type: String })
    description: string;

    @Prop({ type: [String] })
    permissions: string[];

    @Prop({ default: false })
    isDeleted: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);