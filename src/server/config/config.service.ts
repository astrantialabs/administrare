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
 * @fileoverview The configuration service.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";

/**
 * @description The configuration service.
 * @class ConfigService
 */
@Injectable()
export class ConfigService {
    /**
     * @constructor The configuration service.
     * @param {NestConfigService} configServer - The nestjs config service.
     */
    constructor(private readonly configServer: NestConfigService) {}

    /**
     * @description Get the port.
     * @returns {Number} - The port.
     */
    get port(): number {
        return this.configServer.get<number>("port");
    }

    /**
     * @description Get the environment.
     * @returns {String} - The environment.
     */
    get env(): string {
        return this.configServer.get<string>("env");
    }

    /**
     * @description Get the base path.
     * @returns {String} - The base path.
     */
    get basePath(): string {
        return this.configServer.get<string>("basePath");
    }

    /**
     * @description Get the authentication.
     * @returns {Object} - The authentication.
     */
    get authentication(): {
        jwt_secret: string;
        jwt_expiration: string;
        cookie_secret: string;
        session_secret: string;
    } {
        return {
            jwt_secret: this.configServer.get<string>("authentication.jwt_secret"),
            jwt_expiration: this.configServer.get<string>("authentication.jwt_expiration"),
            cookie_secret: this.configServer.get<string>("authentication.cookie_secret"),
            session_secret: this.configServer.get<string>("authentication.session_secret"),
        };
    }

    /**
     * @description Get the database.
     * @returns {Object} - The database.
     */
    get database(): {
        user: {
            collection: string;
            uri: string;
            connection_name: string;
        };
        summary: {
            collection: string;
            uri: string;
            connection_name: string;
        };
        inventory: {
            collection: string;
            uri: string;
            connection_name: string;
        };
        archive: {
            collection: string;
            uri: string;
            connection_name: string;
        };
        session: {
            collection: string;
            uri: string;
            connection_name: string;
        };
        demand: {
            collection: string;
            uri: string;
            connection_name: string;
        };
        request: {
            collection: string;
            uri: string;
            connection_name: string;
        };
    } {
        return {
            user: {
                collection: this.configServer.get<string>("database.user.collection"),
                uri: this.configServer.get<string>("database.user.uri"),
                connection_name: this.configServer.get<string>("database.user.connection_name"),
            },
            summary: {
                collection: this.configServer.get<string>("database.summary.collection"),
                uri: this.configServer.get<string>("database.summary.uri"),
                connection_name: this.configServer.get<string>("database.summary.connection_name"),
            },
            inventory: {
                collection: this.configServer.get<string>("database.inventory.collection"),
                uri: this.configServer.get<string>("database.inventory.uri"),
                connection_name: this.configServer.get<string>("database.inventory.connection_name"),
            },
            archive: {
                collection: this.configServer.get<string>("database.archive.collection"),
                uri: this.configServer.get<string>("database.archive.uri"),
                connection_name: this.configServer.get<string>("database.archive.connection_name"),
            },
            session: {
                collection: this.configServer.get<string>("database.session.collection"),
                uri: this.configServer.get<string>("database.session.uri"),
                connection_name: this.configServer.get<string>("database.session.connection_name"),
            },
            demand: {
                collection: this.configServer.get<string>("database.demand.collection"),
                uri: this.configServer.get<string>("database.demand.uri"),
                connection_name: this.configServer.get<string>("database.demand.connection_name"),
            },
            request: {
                collection: this.configServer.get<string>("database.request.collection"),
                uri: this.configServer.get<string>("database.request.uri"),
                connection_name: this.configServer.get<string>("database.request.connection_name"),
            },
        };
    }
}
