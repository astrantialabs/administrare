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
 * @fileoverview The request inventory controller.
 * @author Rizky Irswanda <rizky.irswanda115@gmail.com>
 */

import { Controller, Get, Logger } from "@nestjs/common";
import { RequestInventoryService } from "./request-inventory.service";
import { RequestBarang } from "./schema/request-inventory.schema";

/**
 * @class RequestInventoryDataController
 * @description The request inventory controller.
 */
@Controller("__api/data/inventory/request")
export class RequestInventoryController {
    private readonly logger = new Logger(RequestInventoryController.name);

    /**
     * @constructor
     * @description Creates a new request inventory controller.
     * @param {RequestInventoryService} requestInventoryService - The request inventory service.
     */
    constructor(private readonly requestInventoryService: RequestInventoryService) {}

    /**
     * @description Get every request item object
     * @returns {Promise<RequestBarang[]>} The request item object
     */
    @Get("barang/all")
    public async requestGetBarangAll(): Promise<RequestBarang[]> {
        return await this.requestInventoryService.requestGetBarangAll(2022);
    }
}
