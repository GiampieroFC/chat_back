import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RoleName } from 'src/roles/entities/role.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class RolesGuard implements CanActivate {


  constructor(
    private readonly reflector: Reflector,
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const roles = this.reflector.get<RoleName[]>(
      META_ROLES,
      context.getHandler()
    );

    console.log("👨🏻‍💻 =>", { roles });


    if (!roles.length) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const hasRole = () => roles.some(role => user.roles.includes(role));
    if (!user || !hasRole()) throw new UnauthorizedException('User does not have the required role: ' + roles.join(', '));


    return true;
  }
}
