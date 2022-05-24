/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/**
 * @fileoverview Global typings declarations.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { Session, SessionData } from "express-session";
import { Environment } from "./enumerations/environment.enum";

export declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: Environment;
            PORT: string;
            BASE_PATH: string;

            AUTHENTICATION_JWT_SECRET: string;
            AUTHENTICATION_JWT_EXPIRATION: string;
            AUTHENTICATION_COOKIE_SECRET: string;
            AUTHENTICATION_SESSION_SECRET: string;

            DATABASE_USER_COLLECTION: string;
            DATABASE_USER_URI: string;
            DATABASE_USER_CONNECTION_NAME: string;

            DATABASE_SUMMARY_COLLECTION: string;
            DATABASE_SUMMARY_URI: string;
            DATABASE_SUMMARY_CONNECTION_NAME: string;

            DATABASE_INVENTORY_COLLECTION: string;
            DATABASE_INVENTORY_URI: string;
            DATABASE_INVENTORY_CONNECTION_NAME: string;

            DATABASE_ARCHIVE_COLLECTION: string;
            DATABASE_ARCHIVE_URI: string;
            DATABASE_ARCHIVE_CONNECTION_NAME: string;

            DATABASE_SESSION_COLLECTION: string;
            DATABASE_SESSION_URI: string;
            DATABASE_SESSION_CONNECTION_NAME: string;
        }
    }
}

declare module "express-session" {
    interface SessionData {
        access_token: string;
    }
}
