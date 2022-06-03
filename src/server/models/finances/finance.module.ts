import { Module } from "@nestjs/common";
import { FinanceController } from "./finance.controller";
import { MasterFinanceModule } from "./master/master-finance.module";

@Module({
    controllers: [FinanceController],
    providers: [],
    imports: [MasterFinanceModule],
})
export class FinanceModule {}
