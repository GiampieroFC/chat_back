import { applyDecorators, UseGuards } from "@nestjs/common";
import { RoleName } from "src/roles/entities/role.entity";
import { RoleProtected } from "./role-protected.decorator";
import { AuthGuard } from "../guards/auth.guard";
import { RolesGuard } from "../guards/roles.guard";

export function Auth(...roles: RoleName[]) {
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(AuthGuard, RolesGuard),
    );
}