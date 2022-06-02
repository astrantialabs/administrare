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
 * @fileoverview The demand inventory controller.
 * @author Rizky Irswanda <rizky.irswanda115@gmail.com>
 */

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
    DemandBarang,
    DemandInventoryData,
    DemandInventoryDataDocument,
    DemandKategori,
} from "./schema/demand-inventory.schema";

/**
 * @class DemandInventoryService
 * @description The demand inventory service.
 */
@Injectable()
export class DemandInventoryService {
    /**
     * @constructor
     * @description Creates a new demand inventory data service.
     * @param {Model} demandInventoryDataModel - The data model.
     */
    constructor(
        @InjectModel(DemandInventoryData.name)
        private readonly demandInventoryDataModel: Model<DemandInventoryDataDocument>
    ) {}

    /**
     * @description Find demand data based on year
     * @param {Number} year - The year
     * @returns {DemandInventoryDataDocument} The demand data
     */
    public async demandFindOne(year: number): Promise<DemandInventoryDataDocument> {
        return await this.demandInventoryDataModel.findOne({ tahun: year }).exec();
    }

    /**
     * @description Get every category demand data based on year
     * @param {Number} year - The year data
     * @returns {DemandKategori[]} - The category demand data
     */
    public async demandGetKategoriAll(year: number): Promise<DemandKategori[]> {
        return (await this.demandFindOne(year)).kategori;
    }

    /**
     * @description Get every item demand data based on year
     * @param {Number} year - The year data
     * @returns {DemandBarang[]} The item demand data
     */
    public async demandGetBarangAll(year: number): Promise<DemandBarang[]> {
        return (await this.demandFindOne(year)).barang;
    }

    /**
     * @description  Get category demand data based on year and id
     * @param {Number} year - The year
     * @param {Number} id - The category demand id
     * @returns {DemandKategori} The category demand data
     */
    public async demandGetKategoriById(year: number, id: number): Promise<DemandKategori> {
        let demand_kategori_data: DemandKategori[] = (await this.demandFindOne(year)).kategori;
        let demand_kategori: DemandKategori;

        demand_kategori_data.forEach((demand_kategori_object) => {
            if (demand_kategori_object.id == id) {
                demand_kategori = demand_kategori_object;
            }
        });

        return demand_kategori;
    }

    /**
     * @description  Get item demand data based on year and id
     * @param {Number} year - The year
     * @param {Number} id - The item demand id
     * @returns {DemandBarang} The item demand data
     */
    public async demandGetBarangById(year: number, id: number): Promise<DemandBarang> {
        let demand_barang_data: DemandBarang[] = (await this.demandFindOne(year)).barang;
        let demand_barang: DemandBarang;

        demand_barang_data.forEach((demand_barang_object) => {
            if (demand_barang_object.id == id) {
                demand_barang = demand_barang_object;
            }
        });

        return demand_barang;
    }

    /**
     * @description Filter category demand data based on status
     * @param {Number} year - The year
     * @param {Number} status - The status
     * @returns {Kategori[]} The filtered category demand data
     */
    public async demandGetKategoriByStatus(year: number, status: number): Promise<DemandKategori[]> {
        let demand_data: DemandInventoryDataDocument = await this.demandFindOne(year);

        let filtered_category_demand_data: DemandKategori[] = demand_data.kategori.filter((category_object) => {
            if (category_object.status == status) {
                return category_object;
            }
        });

        return filtered_category_demand_data;
    }

    /**
     * @description Filter item demand data based on status
     * @param {Number} year - The year
     * @param {Number} status - The status
     * @returns {DemandBarang[]} The filtered item demand data
     */
    public async demandGetBarangByStatus(year: number, status: number): Promise<DemandBarang[]> {
        let demand_data: DemandInventoryDataDocument = await this.demandFindOne(year);

        let filtered_item_demand_data: DemandBarang[] = demand_data.barang.filter((item_object) => {
            if (item_object.status == status) {
                return item_object;
            }
        });

        return filtered_item_demand_data;
    }

    /**
     * @description Create a new category demand
     * @param {Number} year - The year
     * @param {String} username - The user who demands the new category
     * @param {String} category - The new category name
     * @returns {DemandKategori} The new demanded category data
     */
    public async demandCreateKategori(year: number, username: string, category: string): Promise<DemandKategori> {
        let demand_data: DemandInventoryDataDocument = await this.demandFindOne(year);

        let new_category_demand: DemandKategori = {
            id: demand_data.kategori.length + 1,
            username: username,
            kategori: category,
            createad_at: new Date(),
            responded_at: null,
            status: 0,
        };

        demand_data.kategori.push(new_category_demand);

        this.demandInventoryDataModel.replaceOne({ tahun: year }, demand_data, { upsert: true }).exec();

        return new_category_demand;
    }

    /**
     * @description Create a new item demand
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @param {string} username - The user who demands the new item
     * @param {String} item - The new item name
     * @returns {DemandBarang} The new demanded item data
     */
    public async demandCreateBarang(
        year: number,
        category_id: number,
        username: string,
        item: string,
        unit: string
    ): Promise<DemandBarang> {
        let demand_data: DemandInventoryDataDocument = await this.demandFindOne(year);

        let new_item_demand: DemandBarang = {
            id: demand_data.barang.length + 1,
            kategori_id: category_id,
            username: username,
            barang: item,
            satuan: unit,
            createad_at: new Date(),
            responded_at: null,
            status: 0,
        };

        demand_data.barang.push(new_item_demand);

        this.demandInventoryDataModel.replaceOne({ tahun: year }, demand_data, { upsert: true }).exec();

        return new_item_demand;
    }

    /**
     * @description Update status of category demand data
     * @param {Number} year - The year
     * @param {Number} id - The category demand id
     * @param {Number} status - The The new status
     * @returns {DemandKategori} The updated status of category demand data
     */
    public async demandResponseKategoriById(
        year: number,
        id: number,
        status: number
    ): Promise<DemandKategori | HttpException> {
        let status_list = [0, 1, 2];

        if (status_list.includes(status)) {
            let demand_data: DemandInventoryDataDocument = await this.demandFindOne(year);
            let responded_demand_kategori: DemandKategori;

            demand_data.kategori.forEach((demand_kategori_object) => {
                if (demand_kategori_object.id == id) {
                    demand_kategori_object.responded_at = new Date();
                    demand_kategori_object.status = status;

                    responded_demand_kategori = demand_kategori_object;
                }
            });

            this.demandInventoryDataModel.replaceOne({ tahun: year }, demand_data, { upsert: true }).exec();

            return responded_demand_kategori;
        } else if (!status_list.includes(status)) {
            return new HttpException("response status is invalid", HttpStatus.BAD_GATEWAY);
        }
    }

    /**
     * @description Update status of item demand data
     * @param {Number} year - The year
     * @param {Number} id - The item demand id
     * @param {Number} status - The The new status
     * @returns {DemandBarang} The updated status of item demand data
     */
    public async demandResponseBarangById(
        year: number,
        id: number,
        status: number
    ): Promise<DemandBarang | HttpException> {
        let status_list = [0, 1, 2];

        if (status_list.includes(status)) {
            let demand_data: DemandInventoryDataDocument = await this.demandFindOne(year);
            let responded_demand_barang: DemandBarang;

            demand_data.barang.forEach((demand_barang_object) => {
                if (demand_barang_object.id == id) {
                    demand_barang_object.responded_at = new Date();
                    demand_barang_object.status = status;

                    responded_demand_barang = demand_barang_object;
                }
            });

            this.demandInventoryDataModel.replaceOne({ tahun: year }, demand_data, { upsert: true }).exec();

            return responded_demand_barang;
        } else if (!status_list.includes(status)) {
            return new HttpException("response status is invalid", HttpStatus.BAD_GATEWAY);
        }
    }
}
