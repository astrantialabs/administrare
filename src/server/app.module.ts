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
 * @fileoverview The app service.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { DynamicModule, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RenderModule } from "nest-next";
import Next from "next";

import { AppController } from "./app.controller";
import { AuthModule } from "./authentication/auth.module";
import { ConfigModule } from "./config/config.module";
import { FinanceModule } from "./models/finances/finance.module";
import { InventoryModule } from "./models/inventories/inventory.module";
import { UserModule } from "./models/users/user.module";
import { MongoDBProviderModule } from "./providers/mongodb.module";

declare const module: any;

@Module({})
export class AppModule {
    public static initialize(): DynamicModule {
        const renderModule =
            module.hot?.data?.renderModule ??
            RenderModule.forRootAsync(Next({ dev: process.env.NODE_ENV === "development" }), {
                viewsDir: null,
            });

        if (module.hot) {
            module.hot.dispose((data: any) => {
                data.renderModule = renderModule;
            });
        }

        return {
            module: AppModule,
            imports: [
                renderModule,
                ConfigModule,
                MongoDBProviderModule,
                UserModule,
                AuthModule,
                FinanceModule,
                InventoryModule,
            ],
            exports: [ConfigService],
            controllers: [AppController],
            providers: [ConfigService],
        };
    }
}
