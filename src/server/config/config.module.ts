/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/**
 * @fileoverview The configuration module.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule, ConfigService as NestConfigService } from "@nestjs/config";

import { ConfigService } from "./config.service";
import { validation } from "./validation";
import configuration from "./configuration";

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validate: validation,
        }),
    ],
    exports: [NestConfigService, ConfigService],
    controllers: [],
    providers: [NestConfigService, ConfigService],
})
export class ConfigModule {}
