/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/**
 * @fileoverview The app main entry point.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { RenderService } from "nest-next";
import { AppModule } from "./app.module";
import { middleware } from "./common/middlewares/app.middleware";

import { ConfigService } from "./config/config.service";

declare const module: any;

async function boostrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule.initialize());
    const renderService = app.get(RenderService);
    const configService = app.get(ConfigService);

    middleware(app);

    await app.listen(configService.port);

    renderService.setErrorHandler(async (error, request, response) => {
        response.send(error.response);
    });

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}

boostrap();
