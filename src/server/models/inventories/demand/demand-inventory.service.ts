/**
 * administrare - web platform for internal data management
 * Copyright (C) 2022 astrantialabs
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
 * @fileoverview The demand inventory service.
 * @author Rizky Irswanda <rizky.irswanda115@gmail.com>
 */

import { currentDate } from "@/shared/utils/util";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MasterInventoryService } from "../master/master-inventory.service";
import { DemandBarang, DemandInventoryData, DemandInventoryDataDocument, DemandKategori } from "./schema/demand-inventory.schema";

/**
 * @class DemandInventoryService
 * @description The demand inventory service.
 */
@Injectable()
export class DemandInventoryService {
    /**
     * @constructor
     * @description Creates a new demand inventory service.
     * @param {Model} demandInventoryDataModel - The data model.
     */
    constructor(
        @InjectModel(DemandInventoryData.name)
        private readonly demandInventoryDataModel: Model<DemandInventoryDataDocument>,
        private readonly masterInventoryService: MasterInventoryService
    ) {}

    //#region main

    /**
     * @description Find demand documnet based on year
     * @param {Number} year - The year
     * @returns {DemandInventoryDataDocument} The demand document
     */
    public async demandFindOne(year: number): Promise<DemandInventoryDataDocument> {
        return await this.demandInventoryDataModel.findOne({ tahun: year }).exec();
    }

    //#endregion main

    //#region utility

    public async demandBarangWithCategoryName(demand_barang_data: any) {
        let demand_barang_data_with_category_name = await Promise.all(
            demand_barang_data.map(async (item_object: any) => {
                return {
                    ...item_object,
                    kategori_name: await this.masterInventoryService.masterGetKategoriNameByKategoriId(2022, item_object.kategori_id),
                };
            })
        );

        return demand_barang_data_with_category_name;
    }

    //#endregion utility

    //#region crud

    /**
     * @description Get every category demand object
     * @param {Number} year - The year data
     * @returns {Promise<DemandKategori[]>} - The category demand object
     */
    public async demandGetKategoriAll(year: number): Promise<DemandKategori[]> {
        return (await this.demandFindOne(year)).kategori;
    }

    /**
     * @description Get every item demand object
     * @param {Number} year - The year data
     * @returns {Promise<DemandBarang[]>} The item demand object
     */
    public async demandGetBarangAll(year: number): Promise<any> {
        let demand_barang_data: DemandBarang[] = (await this.demandFindOne(year)).barang;

        let demand_barang_data_with_category_name = await this.demandBarangWithCategoryName(demand_barang_data);

        return demand_barang_data_with_category_name;
    }

    /**
     * @description  Get category demand object based on id
     * @param {Number} year - The year
     * @param {Number} id - The category demand id
     * @returns {Promise<DemandKategori>} The category demand object
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
     * @description  Get item demand object based on id
     * @param {Number} year - The year
     * @param {Number} id - The item demand id
     * @returns {Promise<DemandBarang>} The item demand object
     */
    public async demandGetBarangById(year: number, id: number): Promise<any> {
        let demand_barang_data: DemandBarang[] = (await this.demandFindOne(year)).barang;
        let demand_barang: any;

        demand_barang_data.forEach((demand_barang_object: any) => {
            if (demand_barang_object.id == id) {
                demand_barang = demand_barang_object;
            }
        });

        demand_barang["kategori_name"] = await this.masterInventoryService.masterGetKategoriNameByKategoriId(2022, demand_barang.kategori_id);

        return demand_barang;
    }

    /**
     * @description Filter category demand object based on status
     * @param {Number} year - The year
     * @param {Number} status - The status
     * @returns {Promise<DemandKategori[]>} The filtered category demand object
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
     * @description Filter item demand object based on status
     * @param {Number} year - The year
     * @param {Number} status - The status
     * @returns {Promise<DemandBarang[]>} The filtered item demand object
     */
    public async demandGetBarangByStatus(year: number, status: number): Promise<DemandBarang[]> {
        let demand_barang_data: DemandBarang[] = (await this.demandFindOne(year)).barang;

        let filtered_item_demand_data: any = demand_barang_data.filter((item_object: any) => {
            if (item_object.status == status) {
                return item_object;
            }
        });

        let demand_barang_data_with_category_name: any = await this.demandBarangWithCategoryName(filtered_item_demand_data);

        return demand_barang_data_with_category_name;
    }

    /**
     * @description Create a new category object
     * @param {Number} year - The year
     * @param {String} username - The user who demands the new category object
     * @param {String} category - The new demanded category name
     * @returns {Promise<DemandKategori>} The new demanded category object
     */
    public async demandCreateKategori(year: number, username: string, category: string): Promise<DemandKategori> {
        let demand_data: DemandInventoryDataDocument = await this.demandFindOne(year);

        let new_category_demand: DemandKategori = {
            id: demand_data.kategori.length + 1,
            username: username,
            kategori: category,
            created_at: currentDate(),
            responded_at: null,
            status: 0,
        };

        demand_data.kategori.push(new_category_demand);

        this.demandInventoryDataModel.replaceOne({ tahun: year }, demand_data, { upsert: true }).exec();

        return new_category_demand;
    }

    /**
     * @description Create a new item demand object
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @param {string} username - The user who demands the new item object
     * @param {String} item - The new demanded item name
     * @returns {DemandBarang} The new demanded item object
     */
    public async demandCreateBarang(year: number, category_id: number, username: string, item: string, unit: string): Promise<DemandBarang> {
        let demand_data: DemandInventoryDataDocument = await this.demandFindOne(year);

        let new_item_demand: DemandBarang = {
            id: demand_data.barang.length + 1,
            kategori_id: category_id,
            username: username,
            barang: item,
            satuan: unit,
            created_at: currentDate(),
            responded_at: null,
            status: 0,
        };

        demand_data.barang.push(new_item_demand);

        this.demandInventoryDataModel.replaceOne({ tahun: year }, demand_data, { upsert: true }).exec();

        return new_item_demand;
    }

    /**
     * @description Update status of category demand object
     * @param {Number} year - The year
     * @param {Number} id - The category demand id
     * @param {Number} status - The new status
     * @returns {Promise<DemandKategori>} The updated status of category demand object
     */
    public async demandResponseKategoriById(year: number, id: number, status: number): Promise<DemandKategori | HttpException> {
        let status_list = [1, 2];

        if (status_list.includes(status)) {
            let demand_data: DemandInventoryDataDocument = await this.demandFindOne(year);
            let responded_demand_kategori: DemandKategori;

            demand_data.kategori.forEach((demand_kategori_object) => {
                if (demand_kategori_object.id == id) {
                    if (demand_kategori_object.status == 0) {
                        demand_kategori_object.responded_at = currentDate();
                        demand_kategori_object.status = status;

                        responded_demand_kategori = demand_kategori_object;
                    } else if (status_list.includes(demand_kategori_object.status)) {
                        return new HttpException("already responded", HttpStatus.BAD_GATEWAY);
                    }
                }
            });

            this.demandInventoryDataModel.replaceOne({ tahun: year }, demand_data, { upsert: true }).exec();

            return responded_demand_kategori;
        } else if (!status_list.includes(status)) {
            return new HttpException("response status is invalid", HttpStatus.BAD_GATEWAY);
        }
    }

    /**
     * @description Update status of item demand object
     * @param {Number} year - The year
     * @param {Number} id - The item demand id
     * @param {Number} status - The new status
     * @returns {DemandBarang} The updated status of item demand object
     */
    public async demandResponseBarangById(year: number, id: number, status: number): Promise<DemandBarang | HttpException> {
        let status_list = [1, 2];

        if (status_list.includes(status)) {
            let demand_data: DemandInventoryDataDocument = await this.demandFindOne(year);
            let responded_demand_barang: DemandBarang;

            demand_data.barang.forEach((demand_barang_object) => {
                if (demand_barang_object.id == id) {
                    if (demand_barang_object.status == 0) {
                        demand_barang_object.responded_at = currentDate();
                        demand_barang_object.status = status;

                        responded_demand_barang = demand_barang_object;
                    } else if (status_list.includes(demand_barang_object.status)) {
                        return new HttpException("already responded", HttpStatus.BAD_GATEWAY);
                    }
                }
            });

            this.demandInventoryDataModel.replaceOne({ tahun: year }, demand_data, { upsert: true }).exec();

            return responded_demand_barang;
        } else if (!status_list.includes(status)) {
            return new HttpException("response status is invalid", HttpStatus.BAD_GATEWAY);
        }
    }

    //#endregion crud
}
