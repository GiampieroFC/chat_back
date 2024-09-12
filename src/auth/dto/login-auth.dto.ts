import { IsLowercase, IsString, MinLength } from "class-validator";

export class LoginAuthDto {

    @IsString()
    @IsLowercase()
    emailOrUsername: string;

    @IsString()
    @MinLength(4)
    password: string;
}