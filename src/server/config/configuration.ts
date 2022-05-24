/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
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
        inventory: {
            collection: process.env.DATABASE_INVENTORY_COLLECTION || "inventories",
            uri: process.env.DATABASE_INVENTORY_URI || "mongodb://localhost:27017/inventory",
            connection_name: process.env.DATABASE_INVENTORY_CONNECTION_NAME || "inventory_database",
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
    },
});
