import { Module } from "@nestjs/common";
import { FinanceController } from "./finance.controller";

@Module({
    controllers: [FinanceController],
    providers: [],
    imports: [],
})
export class InventoryModule {}
