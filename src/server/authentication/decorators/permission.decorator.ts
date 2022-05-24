import { SetMetadata } from "@nestjs/common";
import { PermissionLevel } from "@shared/typings/enumerations/permission-level.enum";

export const PERMISSION_KEY = "permissions";
export const Permission = (...roles: PermissionLevel[]) => SetMetadata(PERMISSION_KEY, roles);
