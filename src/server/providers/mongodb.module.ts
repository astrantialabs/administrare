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
            connectionName: process.env.DATABASE_MASTER_INVENTORY_CONNECTION_NAME,
            useFactory: async (configService: ConfigService) => ({
                uri: configService.database.master_inventory.uri,
                connectionName: configService.database.master_inventory.connection_name,
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            connectionName: process.env.DATABASE_MASTER_TEST_INVENTORY_CONNECTION_NAME,
            useFactory: async (configService: ConfigService) => ({
                uri: configService.database.master_test_inventory.uri,
                connectionName: configService.database.master_test_inventory.connection_name,
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            connectionName: process.env.DATABASE_DEMAND_INVENTORY_CONNECTION_NAME,
            useFactory: async (configService: ConfigService) => ({
                uri: configService.database.demand_inventory.uri,
                connectionName: configService.database.demand_inventory.connection_name,
            }),
            inject: [ConfigService],
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            connectionName: process.env.DATABASE_REQUEST_INVENTORY_CONNECTION_NAME,
            useFactory: async (configService: ConfigService) => ({
                uri: configService.database.request_inventory.uri,
                connectionName: configService.database.request_inventory.connection_name,
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
