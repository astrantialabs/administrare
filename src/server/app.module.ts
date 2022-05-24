/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
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
            imports: [renderModule, ConfigModule, MongoDBProviderModule, UserModule, AuthModule, InventoryModule],
            exports: [ConfigService],
            controllers: [AppController],
            providers: [ConfigService],
        };
    }
}
