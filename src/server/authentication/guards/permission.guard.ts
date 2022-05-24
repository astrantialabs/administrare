/**
 * administrare - web platform for internal data management
 * Copyright (C) 2022 imperatoria
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
