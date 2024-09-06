import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from 'src/auth/entities/role.entity';


@Schema({ timestamps: true })
export class User extends Document {

    @Prop({ unique: true, required: true, index: true })
    username: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    lastname: string;

    @Prop({ type: String })
    phone?: string;

    @Prop({ unique: true, required: true, index: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop()
    avatar?: string;

    @Prop({ default: false })
    isDeleted: boolean;

    @Prop({ type: Types.ObjectId, ref: Role.name })
    rolesId?: Types.ObjectId;

}

export const UserSchema = SchemaFactory.createForClass(User);
