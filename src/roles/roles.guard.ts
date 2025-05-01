import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { role_key } from 'src/user/decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private  reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    let role = this.reflector.getAllAndOverride(role_key, [
      context.getHandler(),
      context.getClass(),
    ]);
    let reqData = context.switchToHttp().getRequest();


    if (!role.length) {
      
      return true;
    }

    if (role.includes(reqData['user'].role)) {
      
      return true;
    } else {
      throw new UnauthorizedException('U not have access');
    }
  }
}
