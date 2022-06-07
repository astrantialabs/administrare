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
 * @fileoverview The request inventory service.
 * @author Rizky Irswanda <rizky.irswanda115@gmail.com>
 */

import { UtilsService } from "@/server/utils/utils.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { request } from "http";
import { Model } from "mongoose";
import { MasterTestInventoryService } from "../master-test/master-test-inventory.service";
import { MasterTestInventoryDataDocument } from "../master-test/schema/master-test-inventory.schema";
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
        private readonly requestInventoryDataModel: Model<RequestInventoryDataDocument>,
        private readonly utilsService: UtilsService,
        private readonly masterTestInventoryService: MasterTestInventoryService
    ) {}

    /**
     * @description Find request document based on year
     * @param {Number} year - The year
     * @returns {Promise<RequestInventoryDataDocument>} The request document
     */
    public async requestFindOne(year: number): Promise<RequestInventoryDataDocument> {
        return await this.requestInventoryDataModel.findOne({ tahun: year }).exec();
    }

    /**
     * @description Get every request item object
     * @param {Number} year - The year
     * @returns {Promise<RequestBarang[]>} The request item object
     */
    public async requestGetBarangAll(year: number): Promise<RequestBarang[]> {
        return (await this.requestFindOne(year)).barang;
    }

    /**
     * @description Get request item object based on id
     * @param {Number} year - The year
     * @param {Number} id - The id
     * @returns {Promise<RequestBarang>} The request item object
     */
    public async requestGetBarangById(year: number, id: number): Promise<RequestBarang> {
        const request_barang_data: RequestBarang[] = await this.requestGetBarangAll(year);
        let request_barang: RequestBarang;

        request_barang_data.forEach((item_object) => {
            if (item_object.id == id) {
                request_barang = item_object;
            }
        });

        return request_barang;
    }

    /**
     * @description Get request item object based on status
     * @param {Number} year - The year
     * @param {Number} status - The status
     * @returns {Promise<RequestBarang[]>} The request item object
     */
    public async requestGetBarangByStatus(year: number, status: number): Promise<RequestBarang[]> {
        const request_barang_data: RequestBarang[] = await this.requestGetBarangAll(year);
        let request_barang: RequestBarang[] = [];

        request_barang_data.forEach((item_object) => {
            if (item_object.status == status) {
                request_barang.push(item_object);
            }
        });

        return request_barang;
    }

    /**
     * @description Create a new request barang object
     * @param {Number} year - The year
     * @param {RequestBarang} item - The new request barang object
     * @returns {Promise<RequestBarang>} The new request barang object
     */
    public async requestCreateBarang(year: number, item: RequestBarang): Promise<RequestBarang> {
        let request_inventory_data: RequestInventoryDataDocument = await this.requestFindOne(year);

        request_inventory_data.barang.push(item);

        this.requestInventoryDataModel.replaceOne({ tahun: year }, request_inventory_data, { upsert: true }).exec();

        return item;
    }

    /**
     * @description Response an barang object based on id and status
     * @param {Number} year - The year
     * @param {Number} id - The barang id
     * @param {Number} status - The status
     * @returns {Promise<RequestBarang>} Return the responded barang object
     */
    public async requestResponseBarangById(
        year: number,
        id: number,
        status: number
    ): Promise<RequestBarang | HttpException> {
        let status_list = [1, 2];

        if (status_list.includes(status)) {
            let request_inventory_data: RequestInventoryDataDocument = await this.requestFindOne(year);
            let responded_request_barang: RequestBarang;

            request_inventory_data.barang.forEach((request_item_object) => {
                if (request_item_object.id == id) {
                    if (request_item_object.status == 0) {
                        request_item_object.responded_at = this.utilsService.currentDate();
                        request_item_object.status = status;

                        responded_request_barang = request_item_object;

                        this.masterTestInventoryService.masterResponseJumlahPermintaanByKategoriIdAndBarangId(
                            2022,
                            request_item_object.kategori_id,
                            request_item_object.barang_id,
                            request_item_object.total,
                            request_item_object.status
                        );
                    } else if (status_list.includes(request_item_object.status)) {
                        return new HttpException("already responded", HttpStatus.BAD_GATEWAY);
                    }
                }
            });

            this.requestInventoryDataModel.replaceOne({ tahun: year }, request_inventory_data, { upsert: true }).exec();
            
            return responded_request_barang;
        } else if (!status_list.includes(status)) {
            return new HttpException("response status is invalid", HttpStatus.BAD_GATEWAY);
        }
    }
}
