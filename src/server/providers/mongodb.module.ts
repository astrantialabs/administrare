/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/**
 * @fileoverview MongoDB provider.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            connectionName: process.env.DATABASE_USER_CONNECTION_NAME,
            useFactory: async (configService: ConfigService) => ({
                uri: configService.database.user.uri,
                connectionName: configService.database.user.connection_name,
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            connectionName: process.env.DATABASE_INVENTORY_CONNECTION_NAME,
            useFactory: async (configService: ConfigService) => ({
                uri: configService.database.inventory.uri,
                connectionName: configService.database.inventory.connection_name,
            }),
            inject: [ConfigService],
        }),
        ConfigModule,
    ],
    exports: [],
    controllers: [],
    providers: [],
})
export class MongoDBProviderModule {}
