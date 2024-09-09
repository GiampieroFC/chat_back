import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Role extends Document {

    @Prop({ unique: true, required: true })
    role: string;

    @Prop()
    description?: string;

}

export const RoleSchema = SchemaFactory.createForClass(Role);
