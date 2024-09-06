import { IsString, MinLength, IsPhoneNumber, IsOptional, IsEmail, IsLowercase, IsUrl, IsNumber, IsPositive, Min, Max, IsMongoId } from "class-validator";

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

    @IsPhoneNumber()
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

    @IsOptional()
    @IsMongoId()
    roleId?: string;
}
