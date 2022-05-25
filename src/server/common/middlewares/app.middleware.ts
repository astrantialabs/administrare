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
 * @fileoverview The app middleware.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { INestApplication } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { default as connectMongoDBSession } from "connect-mongodb-session";
import { initialize } from "passport";
import compression from "compression";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import helmet from "helmet";
import csurf from "csurf";

import { Environment } from "@/shared/typings/enumerations/environment.enum";

import { ConfigService } from "../../config/config.service";

const MongoDBStore = connectMongoDBSession(session);

export function middleware(app: NestExpressApplication): INestApplication {
    const configService = app.get(ConfigService);

    let store = new MongoDBStore({
        uri: configService.database.session.uri,
        collection: configService.database.session.collection,
    });

    if (configService.env === Environment.PRODUCTION) {
        app.enable("trust proxy");
    }

    app.use(compression());
    app.use(
        helmet({
            contentSecurityPolicy: configService.env === Environment.PRODUCTION ? undefined : false,
        })
    );
    app.use(cookieParser(configService.authentication.cookie_secret));
    app.use(
        session({
            secret: configService.authentication.session_secret,
            resave: false,
            saveUninitialized: false,
            store: store,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 7,
            },
        })
    );
    // app.use(csurf());
    app.use(initialize());
    app.use(passport.session());

    return app;
}
