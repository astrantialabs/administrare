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

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UtilsModule } from "../../utils/utils.module";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./inventory.service";
import { InventoryData, InventoryDataSchema } from "./schema/inventory.schema";

@Module({
    imports: [
        UtilsModule,
        MongooseModule.forFeature(
            [
                {
                    name: InventoryData.name,
                    schema: InventoryDataSchema,
                    collection: process.env.DATABASE_INVENTORY_COLLECTION,
                },
            ],
            process.env.DATABASE_INVENTORY_CONNECTION_NAME
        ),
    ],
    exports: [InventoryService],
    controllers: [InventoryController],
    providers: [InventoryService],
})
export class InventoryModule {}