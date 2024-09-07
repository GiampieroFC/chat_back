import { IsEnum, IsOptional, IsString } from "class-validator";
import { RoleName } from "../entities/role.entity";

export class CreateRoleDto {

    @IsEnum(RoleName, { message: 'role must be one of the values: ' + Object.values(RoleName).join(', ') })
    @IsOptional()
    @IsString()
    name: RoleName;

    @IsString()
    @IsOptional()
    description: string;

}
