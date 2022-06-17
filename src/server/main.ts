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

declare const module: any;

async function boostrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule.initialize());
    const renderService = app.get(RenderService);
    const configService = app.get(ConfigService);

    middleware(app);

    app.enableCors({
        origin: ["http://localhost:3000", "http://localhost:3001", "http://setdisnakerbppn.com", "https://setdisnakerbppn.com"],
    });
    await app.listen(configService.port).then(() => Logger.log(`Listening on http://localhost:${configService.port}`));

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
