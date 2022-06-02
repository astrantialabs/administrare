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

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RequestBarang, RequestInventoryData, RequestInventoryDataDocument } from "./schema/request-inventory.schema";

/**
 * @class RequestInventoryService
 * @description The request inventory service.
 */
@Injectable()
export class RequestInventoryService {
    /**
     * @constructor
     * @description Creates a new request inventory data service.
     * @param {Model} requestInventoryDataModel - The data model.
     */
    constructor(
        @InjectModel(RequestInventoryData.name)
        private readonly requestInventoryDataModel: Model<RequestInventoryDataDocument>
    ) {}

    /**
     * @description Find request data based on year
     * @param {Number} year - The year
     * @returns {RequestInventoryDataDocument} The request data
     */
    public async requestFindOne(year: number): Promise<RequestInventoryDataDocument> {
        return await this.requestInventoryDataModel.findOne({ tahun: year }).exec();
    }

    /**
     * @description Get every requested item data based on year
     * @param {Number} year - The year
     * @returns {RequestBarang[]} The requested item data
     */
    public async requestGetBarangAll(year: number): Promise<RequestBarang[]> {
        return (await this.requestFindOne(year)).barang;
    }
}
