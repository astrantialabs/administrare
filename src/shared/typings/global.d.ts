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

            DATABASE_ARCHIVE_COLLECTION: string;
            DATABASE_ARCHIVE_URI: string;
            DATABASE_ARCHIVE_CONNECTION_NAME: string;

            DATABASE_SESSION_COLLECTION: string;
            DATABASE_SESSION_URI: string;
            DATABASE_SESSION_CONNECTION_NAME: string;

            DATABASE_MASTER_INVENTORY_COLLECTION: string;
            DATABASE_MASTER_INVENTORY_URI: string;
            DATABASE_MASTER_INVENTORY_CONNECTION_NAME: string;

            DATABASE_MASTER_TEST_INVENTORY_COLLECTION: string;
            DATABASE_MASTER_TEST_INVENTORY_URI: string;
            DATABASE_MASTER_TEST_INVENTORY_CONNECTION_NAME: string;

            DATABASE_DEMAND_INVENTORY_COLLECTION: string;
            DATABASE_DEMAND_INVENTORY_URI: string;
            DATABASE_DEMAND_INVENTORY_CONNECTION_NAME: string;

            DATABASE_REQUEST_INVENTORY_COLLECTION: string;
            DATABASE_REQUEST_INVENTORY_URI: string;
            DATABASE_REQUEST_INVENTORY_CONNECTION_NAME: string;
        }
    }
}

declare module "express-session" {
    interface SessionData {
        access_token: string;
    }
}
