/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/**
 * @fileoverview Validation for the config file.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { plainToClass } from "class-transformer";
import { IsEnum, IsNumber, isString, IsString, validateSync } from "class-validator";

import { Environment } from "@shared/typings/enumerations/environment.enum";

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
}

export function validation(config: Record<string, unknown>): EnvironmentVariables {
    const validatedConfig = plainToClass(EnvironmentVariables, config, { enableImplicitConversion: true });
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
