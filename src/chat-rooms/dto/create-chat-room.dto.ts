import { ChatRoomType } from "../entities/chat-room.entity";
import { IsOptional, IsString, MinLength, IsEnum, IsMongoId, IsDefined, IsObject, isMongoId, registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import { RoleName } from "src/roles/entities/role.entity";

export class CreateChatRoomDto {
    @IsString()
    @MinLength(2)
    name: string;
  
    @IsString()
    @MinLength(6)
    @IsOptional()
    description?: string;
  
    @IsString()
    @IsEnum(ChatRoomType)
    chatRoomType: ChatRoomType;

    @IsObject()  // Esto verifica que members sea un objeto, pero opcional
    @IsOptional()
    members?: Record<string, RoleName>; 
  
    @IsString()
    @MinLength(4)
    @IsOptional()
    password?: string;
  }

export function IsValidKeyObjectId(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'isValidMembers',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (typeof value !== 'object' || value === null) return false;

                    for (const key of Object.keys(value)) {
                        // Validamos que las claves sean MongoDB ObjectId
                        if (!isMongoId(key)) {
                            return false; // Invalid ObjectId key
                        }
                    }

                    return true; // Both keys and values are valid
                },
                defaultMessage(): string {
                    return 'The keys must be valid MongoDB ObjectId strings';
                },
            },
        });
    };
}

export function IsValidValueRolename(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'isValidMembers',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    if (typeof value !== 'object' || value === null) return false;

                    for (const role of Object.values(value)) {
                        // Validamos que los valores sean roles válidos
                        if (!Object.values(RoleName).includes(role as RoleName)) {
                            return false; // Invalid role value
                        }
                    }

                    return true; // Both keys and values are valid
                },
                defaultMessage(): string {
                    return `The values must be valid roles: ${Object.values(RoleName).join(', ')}`;
                },
            },
        });
    };
}