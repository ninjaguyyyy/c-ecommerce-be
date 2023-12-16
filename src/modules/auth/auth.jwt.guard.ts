import {
  ExecutionContext, ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { User } from "@prisma/client";

import { Role } from "shared/constants/global.constants";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  roles: string[];

  constructor(private reflector: Reflector) {
    super(reflector);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.roles = this.reflector.get<string[]>("roles", context.getHandler());
    if (this.roles?.includes(Role.PUBLIC)) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err: Error, user: User): any {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    if (!this.roles) {
      return user;
    }

    const hasPermission = this.roles.includes(user.role);
    if (!hasPermission) {
      throw new ForbiddenException();
    }

    return user;
  }
}
