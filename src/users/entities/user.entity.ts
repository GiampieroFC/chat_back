import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role, RoleName } from 'src/roles/entities/role.entity';


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

    @Prop({ default: false })
    isConnected: boolean;

    // Propiedad para almacenar roles
    @Prop({
        type: [String], // Un array de strings
        enum: RoleName, // Limita los valores posibles al enum RoleName
        default: [RoleName.User] // Valor predeterminado en caso de no especificarse
    })
    roles?: RoleName[];
}

export const UserSchema = SchemaFactory.createForClass(User);
