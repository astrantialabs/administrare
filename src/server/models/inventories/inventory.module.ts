import { Module } from "@nestjs/common";
import { InventoryController } from "./inventory.controller";

import { DemandInventoryModule } from "./demand/demand-inventory.module";
import { MasterInventoryModule } from "./master/master-inventory.module";
import { RequestInventoryModule } from "./request/request-inventory.module";

@Module({
    controllers: [InventoryController],
    providers: [],
    imports: [DemandInventoryModule, MasterInventoryModule, RequestInventoryModule],
})
export class InventoryModule {}
