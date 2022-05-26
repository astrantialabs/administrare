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

/**
 * @fileoverview Validation for the config file.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { plainToClass } from "class-transformer";
import { IsEnum, IsNumber, IsString, validateSync } from "class-validator";

import { Environment } from "@/shared/typings/enumerations/environment.enum";

class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment;
    @IsNumber()
    PORT: number;
    @IsString()
    BASE_PATH: string;

    @IsString()
    AUTHENTICATION_JWT_SECRET: string;
    @IsString()
    AUTHENTICATION_JWT_EXPIRATION: string;
    @IsString()
    AUTHENTICATION_COOKIE_SECRET: string;
    @IsString()
    AUTHENTICATION_SESSION_SECRET: string;

    @IsString()
    DATABASE_USER_COLLECTION: string;
    @IsString()
    DATABASE_USER_URI: string;
    @IsString()
    DATABASE_USER_CONNECTION_NAME: string;

    @IsString()
    DATABASE_SUMMARY_COLLECTION: string;
    @IsString()
    DATABASE_SUMMARY_URI: string;
    @IsString()
    DATABASE_SUMMARY_CONNECTION_NAME: string;

    @IsString()
    DATABASE_INVENTORY_COLLECTION: string;
    @IsString()
    DATABASE_INVENTORY_URI: string;
    @IsString()
    DATABASE_INVENTORY_CONNECTION_NAME: string;

    @IsString()
    DATABASE_ARCHIVE_COLLECTION: string;
    @IsString()
    DATABASE_ARCHIVE_URI: string;
    @IsString()
    DATABASE_ARCHIVE_CONNECTION_NAME: string;

    @IsString()
    DATABASE_SESSION_COLLECTION: string;
    @IsString()
    DATABASE_SESSION_URI: string;
    @IsString()
    DATABASE_SESSION_CONNECTION_NAME: string;

    @IsString()
    DATABASE_DEMAND_INVENTORY_COLLECTION: string;
    @IsString()
    DATABASE_DEMAND_INVENTORY_URI: string;
    @IsString()
    DATABASE_DEMAND_INVENTORY_CONNECTION_NAME: string;
}

export function validation(config: Record<string, unknown>): EnvironmentVariables {
    const validatedConfig = plainToClass(EnvironmentVariables, config, { enableImplicitConversion: true });
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
