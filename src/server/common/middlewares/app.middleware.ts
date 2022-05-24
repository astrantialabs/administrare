/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/**
 * @fileoverview The app middleware.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { INestApplication } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { default as connectMongoDBSession } from "connect-mongodb-session";
import compression from "compression";
import cookieParser from "cookie-parser";
import session from "express-session";
import helmet from "helmet";
import csurf from "csurf";

import { Environment } from "@shared/typings/enumerations/environment.enum";
import { ConfigService } from "../../config/config.service";

import { initialize } from "passport";
import passport from "passport";

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
    app.use(csurf());
    app.use(initialize());
    app.use(passport.session());

    return app;
}
