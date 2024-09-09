import { SetMetadata } from '@nestjs/common';
import { RoleName } from 'src/roles/entities/role.entity';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: RoleName[]) => SetMetadata(META_ROLES, args);
