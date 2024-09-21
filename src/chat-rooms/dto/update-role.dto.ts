import { IsEnum, IsString } from 'class-validator';
import { RoleName } from 'src/roles/entities/role.entity';

export class UpdateRoleDto {
  @IsString()
  userId: string;

  @IsEnum(RoleName)
  newRole: RoleName;
}
