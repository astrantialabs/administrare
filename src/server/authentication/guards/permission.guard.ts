import { Injectable, CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { PermissionLevel } from "@shared/typings/enumerations/permission-level.enum";
import { UserService } from "../../models/users/user.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, @Inject(UserService) private userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<PermissionLevel[]>("permissions", context.getHandler());

        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const userId = request.cookie["_user_id"];

        const user = await this.userService.findOneById(userId);

        return roles.some((role) => user.permissionLevel.includes(role));
    }
}
