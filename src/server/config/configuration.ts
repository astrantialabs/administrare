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
 * @fileoverview Configuration for the server.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    env: process.env.NODE_ENV || "development",
    basePath: process.env.BASE_PATH || "",
    authentication: {
        jwt_secret: process.env.AUTHENTICATION_JWT_SECRET || "disnakerbalikpapan",
        jwt_expiration: process.env.AUTHENTICATION_JWT_EXPIRATION || "1h",
        cookie_secret: process.env.AUTHENTICATION_COOKIE_SECRET || "disnakerbalikpapan",
        session_secret: process.env.AUTHENTICATION_SESSION_SECRET || "disnakerbalikpapan",
    },
    database: {
        user: {
            collection: process.env.DATABASE_USER_COLLECTION || "users",
            uri: process.env.DATABASE_USER_URI || "mongodb://localhost:27017/user",
            connection_name: process.env.DATABASE_USER_CONNECTION_NAME || "user_database",
        },
        summary: {
            collection: process.env.DATABASE_SUMMARY_COLLECTION || "summaries",
            uri: process.env.DATABASE_SUMMARY_URI || "mongodb://localhost:27017/summary",
            connection_name: process.env.DATABASE_SUMMARY_CONNECTION_NAME || "summary_database",
        },
        archive: {
            collection: process.env.DATABASE_ARCHIVE_COLLECTION || "archives",
            uri: process.env.DATABASE_ARCHIVE_URI || "mongodb://localhost:27017/archive",
            connection_name: process.env.DATABASE_ARCHIVE_CONNECTION_NAME || "archive_database",
        },
        session: {
            collection: process.env.DATABASE_SESSION_COLLECTION || "sessions",
            uri: process.env.DATABASE_SESSION_URI || "mongodb://localhost:27017/session",
            connection_name: process.env.DATABASE_SESSION_CONNECTION_NAME || "session_database",
        },
        master_inventory: {
            collection: process.env.DATABASE_MASTER_INVENTORY_COLLECTION || "master-inventory",
            uri: process.env.DATABASE_MASTER_INVENTORY_URI || "mongodb://localhost:27017/inventory",
            connection_name: process.env.DATABASE_MASTER_INVENTORY_CONNECTION_NAME || "master_inventory_database",
        },
        master_test_inventory: {
            collection: process.env.DATABASE_MASTER_TEST_INVENTORY_COLLECTION || "master-test-inventory",
            uri: process.env.DATABASE_MASTER_TEST_INVENTORY_URI || "mongodb://localhost:27017/inventory",
            connection_name:
                process.env.DATABASE_MASTER_TEST_INVENTORY_CONNECTION_NAME || "master_test_inventory_database",
        },
        demand_inventory: {
            collection: process.env.DATABASE_DEMAND_INVENTORY_COLLECTION || "demand-inventory",
            uri: process.env.DATABASE_DEMAND_INVENTORY_URI || "mongodb://localhost:27017/inventory",
            connection_name: process.env.DATABASE_DEMAND_INVENTORY_CONNECTION_NAME || "demand_inventory_database",
        },
        request_inventory: {
            collection: process.env.DATABASE_REQUEST_INVENTORY_COLLECTION || "request-inventory",
            uri: process.env.DATABASE_REQUEST_INVENTORY_URI || "mongodb://localhost:27017/inventory",
            connection_name: process.env.DATABASE_REQUEST_INVENTORY_CONNECTION_NAME || "request_inventory_database",
        },
    },
});
