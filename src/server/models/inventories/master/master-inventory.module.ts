/**
 * administrare - web platform for internal data management
 * Copyright (C) 2022 astrantialabs
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

import { MasterInventoryController } from "./master-inventory.controller";
import { MasterInventoryService } from "./master-inventory.service";
import { MasterInventoryData, MasterInventoryDataSchema } from "./schema/master-inventory.schema";

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                {
                    name: MasterInventoryData.name,
                    schema: MasterInventoryDataSchema,
                    collection: process.env.DATABASE_MASTER_INVENTORY_COLLECTION,
                },
            ],
            process.env.DATABASE_MASTER_INVENTORY_CONNECTION_NAME
        ),
    ],
    exports: [MasterInventoryService],
    controllers: [MasterInventoryController],
    providers: [MasterInventoryService],
})
export class MasterInventoryModule {}
