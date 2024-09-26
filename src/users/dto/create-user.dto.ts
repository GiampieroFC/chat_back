import { IsString, MinLength, IsOptional, IsEmail, IsLowercase, IsUrl, IsEnum, registerDecorator, ValidationArguments, ValidationOptions, } from "class-validator";
import { RoleName } from "src/roles/entities/role.entity";
import { ContactSchema } from "../entities/user.entity";
import { IsValidKeyObjectId } from "src/chat-rooms/dto/create-chat-room.dto";

export class CreateUserDto {

    @IsString()
    @MinLength(2)
    username: string;

    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @MinLength(3)
    lastname: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsEmail()
    @IsLowercase()
    email: string;

    @IsString()
    @MinLength(4)
    password: string;

    @IsLowercase()
    @IsOptional()
    @IsUrl()
    avatar?: string;

    // Validación de roles basada en el enum RoleName
    @IsEnum(RoleName, { each: true, message: 'role must be one of the values: ' + Object.values(RoleName).join(', ') })
    @IsOptional()
    roles?: RoleName[]; // Permite múltiples roles como un array de RoleName

    @IsValidValueContact()
    @IsValidKeyObjectId()
    @IsOptional()
    contacts?: Record<string, ContactSchema>; // Permite múltiples roles como un array de RoleName
}

export function IsValidValueContact(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'isValidValueContact',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (typeof value !== 'object' || value === null) return false;

                    const constactSchema = Object.values(value);

                    console.log(constactSchema);
                    console.log(Object.keys(constactSchema));

                    for (let i = 0; i < constactSchema.length; i++) {

                        if (typeof constactSchema[i] !== 'object' || constactSchema[i] === null || Object.keys(constactSchema[i])[0] !== 'isBlocked') {
                            return false;
                        }

                    }

                    return true; // Both keys and values are valid
                },
                defaultMessage(): string {
                    return `The values os "contact" must be valid roles: isBlocked`;
                },
            },
        });
    };
}