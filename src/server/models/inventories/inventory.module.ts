import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UtilsModule } from "src/server/utils/utils.module";
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
