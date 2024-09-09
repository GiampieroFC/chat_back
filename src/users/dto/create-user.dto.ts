import { IsString, MinLength, IsOptional, IsEmail, IsLowercase, IsUrl, IsEnum, } from "class-validator";
import { RoleName } from "src/roles/entities/role.entity";

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
}
