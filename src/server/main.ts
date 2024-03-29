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

/**
 * @fileoverview The app main entry point.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { RenderService } from "nest-next";

import { Environment } from "@/shared/typings/enumerations/environment.enum";

import { AppModule } from "./app.module";
import { middleware } from "./common/middlewares/app.middleware";
import { ConfigService } from "./config/config.service";
import { BASE_DOMAIN } from "@/shared/typings/constants";

declare const module: any;

async function boostrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule.initialize());
    const renderService = app.get(RenderService);
    const configService = app.get(ConfigService);

    middleware(app);

    app.use((req: any, res: { header: (arg0: string, arg1: string) => void }, next: () => void) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
        next();
    });

    const origins: string[] = [
        "http://inventory.setdisnakerbppn.com/",
        "https://inventory.setdisnakerbppn.com/",
        "http://localhost:3000/",
        "https://localhost:3000/",
        "http://localhost:3001/",
        "https://localhost:3001/",
    ];

    app.enableCors({
        credentials: true,
        origin: origins,
        allowedHeaders: "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    });
    await app.listen(configService.port).then(() => Logger.log(`Listening on ${BASE_DOMAIN} with ${process.env.NODE_ENV} build.`));

    renderService.setErrorHandler(async (error, request, response) => {
        if (configService.env === Environment.DEVELOPMENT) Logger.debug(error);
        response.send(error.response);
    });

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

boostrap();
