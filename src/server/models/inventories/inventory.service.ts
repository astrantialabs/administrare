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
 * @fileoverview The inventory service.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Barang, Inventory, InventoryData, InventoryDataDocument } from "./schema/inventory.schema";
import {
    DemandBarang,
    DemandInventoryData,
    DemandInventoryDataDocument,
    DemandKategori,
} from "./schema/demand-inventory";

/**
 * @class InventoryService
 * @description Inventory service.
 */
@Injectable()
export class InventoryService {
    /**
     * @constructor
     * @description Creates a new inventory data service.
     * @param {Model} inventoryDataModel - The data model.
     */
    constructor(
        @InjectModel(InventoryData.name) private readonly inventoryDataModel: Model<InventoryDataDocument>,
        @InjectModel(DemandInventoryData.name)
        private readonly demandInventoryDataModel: Model<DemandInventoryDataDocument>
    ) {}

    //#region main

    /**
     * @description Finds all inventory data.
     * @returns {Promise<InventoryDataDocument[]>} The data.
     */
    public async findAll(): Promise<InventoryDataDocument[]> {
        return this.inventoryDataModel.find().exec();
    }

    /**
     * @description Finds a inventory data by its year.
     * @param {Number} year - The year.
     * @returns {Promise<InventoryDataDocument>}
     */
    public async findOne(year: number): Promise<InventoryDataDocument> {
        return this.inventoryDataModel.findOne({ year }).exec();
    }

    //#endregion main

    //#region utilities

    /**
     * @description Find category length based on year
     * @param {Number} year - The year
     * @returns {Number} The category length data
     */
    public async findCategoryLengthByYear(year: number): Promise<number> {
        let inventory_data = await this.findOne(year);
        let category_length: number = inventory_data.inventory.length;

        return category_length;
    }

    /**
     * @description Get a new category id that hasn't been used yet by other inventory objects
     * @param {Number} year - The year
     * @returns {Number} The new category id
     */
    public async getNewCategoryId(year: number): Promise<number> {
        let category_length: number = await this.findCategoryLengthByYear(year);
        let inventory_data: InventoryDataDocument = await this.findOne(year);
        let new_category_id: number = category_length + 1;

        for (let i = 0; i < category_length; i++) {
            if (inventory_data.inventory[i].id != i + 1) {
                new_category_id = i + 1;
                break;
            }
        }

        return new_category_id;
    }

    /**
     * @description Find item length based on year and category id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @returns {Number} The item length data
     */
    public async findItemLengthByYearAndCategoryId(year: number, category_id: number): Promise<number> {
        let inventory_data = await this.findOne(year);
        let item_length: number;

        inventory_data.inventory.filter((category_object) => {
            if (category_object.id == category_id) {
                item_length = category_object.barang.length;
            }
        });

        return item_length;
    }

    /**
     * @description Get a new item id that hasn't been used yet by other item objects
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @returns {Number} The new item id
     */
    public async getNewItemId(year: number, category_id: number): Promise<number> {
        let category_length: number = await this.findCategoryLengthByYear(year);
        let item_length: number = await this.findItemLengthByYearAndCategoryId(year, category_id);
        let inventory_data: InventoryDataDocument = await this.findOne(year);
        let new_item_id: number = item_length + 1;

        for (let i = 0; i < category_length; i++) {
            if (inventory_data.inventory[i].id == category_id) {
                for (let j = 0; j < item_length; j++) {
                    if (inventory_data.inventory[i].barang[j].id != j + 1) {
                        new_item_id = j + 1;
                        break;
                    }
                }

                break;
            }
        }

        return new_item_id;
    }

    //#endregion utilities

    //#region crud

    /**
     * @description Get category data based on year and category id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @returns {Inventory} The category data
     */
    public async getKategori(year: number, category_id: number): Promise<Inventory> {
        let inventory_data: InventoryDataDocument = await this.findOne(year);
        let category_data: Inventory;

        inventory_data.inventory.forEach((category_object) => {
            if (category_object.id == category_id) {
                category_data = category_object;
            }
        });

        return category_data;
    }

    /**
     * @description Get item data based on year, category id and item id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @returns {Barang} The item data
     */
    public async getItem(year: number, category_id: number, item_id: number): Promise<Barang> {
        let inventory_data: InventoryDataDocument = await this.findOne(year);
        let item_data: Barang;

        inventory_data.inventory.forEach((category_object) => {
            if (category_object.id == category_id) {
                category_object.barang.forEach((item_object) => {
                    if (item_object.id == item_id) {
                        item_data = item_object;
                    }
                });
            }
        });

        return item_data;
    }

    /**
     * @description Create a new category then add based on year
     * @param {Number} year - The year
     * @param {String} category - The category
     * @returns {Inventory} The new category data
     */
    public async createKategori(year: number, category: string): Promise<Inventory> {
        let inventory_data: InventoryDataDocument = await this.findOne(year);
        let new_category: Inventory = {
            id: await this.getNewCategoryId(year),
            kategori: category,
            barang: [],
        };

        inventory_data.inventory.push(new_category);
        inventory_data.inventory.sort((a: Inventory, b: Inventory) => a.id - b.id);

        this.inventoryDataModel.replaceOne({ tahun: year }, inventory_data, { upsert: true }).exec();

        return new_category;
    }

    /**
     * @description Create a new item then add based on year and category id
     * @param {Number} year - The year
     * @param {Number} category_id -The category id
     * @param {Barang} item_data - The data required
     * @returns {Barang} The new item data
     */
    public async createBarang(year: number, category_id: number, item_data: Barang): Promise<Barang> {
        let inventory_data: InventoryDataDocument = await this.findOne(year);
        let new_item: Barang;

        inventory_data.inventory.forEach((category_object) => {
            if (category_object.id == category_id) {
                new_item = {
                    id: item_data.id,
                    nama: item_data.nama,
                    satuan: item_data.satuan,
                    saldo: item_data.saldo,
                    mutasi_barang_masuk: item_data.mutasi_barang_masuk,
                    mutasi_barang_keluar: item_data.mutasi_barang_keluar,
                    saldo_akhir: item_data.saldo_akhir,
                };

                category_object.barang.push(new_item);
                category_object.barang.sort((a: Barang, b: Barang) => a.id - b.id);
            }
        });

        this.inventoryDataModel.replaceOne({ tahun: year }, inventory_data, { upsert: true }).exec();

        return new_item;
    }

    /**
     * @description Update category data based on year and category id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @param {String} category_name - The new category name
     * @returns {Inventory} The updated category data
     */
    public async updateKategori(year: number, category_id: number, category_name: string): Promise<Inventory> {
        let inventory_data: InventoryDataDocument = await this.findOne(year);
        let updated_category_data: Inventory;

        inventory_data.inventory.forEach((category_object) => {
            if (category_object.id == category_id) {
                category_object.kategori = category_name;

                updated_category_data = category_object;
            }
        });

        this.inventoryDataModel.replaceOne({ tahun: year }, inventory_data, { upsert: true }).exec();

        return updated_category_data;
    }

    /**
     * @description Update item data based on year, category id and item id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @param {Barang} item_data - The new item data
     * @returns {Barang} The Updated item data
     */
    public async updateItem(year: number, category_id: number, item_id: number, item_data: Barang): Promise<Barang> {
        let inventory_data: InventoryDataDocument = await this.findOne(year);
        let updated_item_data: Barang;

        inventory_data.inventory.forEach((category_object) => {
            if (category_object.id == category_id) {
                category_object.barang.forEach((item_object, index) => {
                    if (item_object.id == item_id) {
                        category_object.barang[index] = item_data;

                        updated_item_data = category_object.barang[index];
                    }
                });
            }
        });

        this.inventoryDataModel.replaceOne({ tahun: year }, inventory_data, { upsert: true }).exec();

        return updated_item_data;
    }

    /**
     * @description Delete category data based on year and category id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @returns {Inventory} The deleted category data
     */
    public async deleteKategori(year: number, category_id: number): Promise<Inventory> {
        let inventory_data: InventoryDataDocument = await this.findOne(year);
        let deleted_category: Inventory;

        inventory_data.inventory.forEach((category_object, index) => {
            if (category_object.id == category_id) {
                deleted_category = category_object;
                inventory_data.inventory.splice(index, 1);
            }
        });

        this.inventoryDataModel.replaceOne({ tahun: year }, inventory_data, { upsert: true }).exec();

        return deleted_category;
    }

    /**
     * @description Delete item data based on year, category id and item id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @returns {Barang} The deleted item data
     */
    public async deleteBarang(year: number, category_id: number, item_id: number): Promise<Barang> {
        let inventory_data: InventoryDataDocument = await this.findOne(year);
        let deleted_item: Barang;

        inventory_data.inventory.forEach((category_object) => {
            if (category_object.id == category_id) {
                category_object.barang.forEach((item_object, index) => {
                    if (item_object.id == item_id) {
                        deleted_item = item_object;
                        category_object.barang.splice(index, 1);
                    }
                });
            }
        });

        this.inventoryDataModel.replaceOne({ tahun: year }, inventory_data, { upsert: true }).exec();

        return deleted_item;
    }

    //#endregion crud

    //#region demand

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
    public async demandKategoriAll(year: number): Promise<DemandKategori[]> {
        return (await this.demandFindOne(year)).kategori;
    }

    /**
     * @description  Get category demand data based on year and id
     * @param {Number} year - The year
     * @param {Number} id - The category demand id
     * @returns {DemandKategori} The category demand data
     */
    public async demandKategoriById(year: number, id: number): Promise<DemandKategori> {
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
     * @description Filter category demand data based on status
     * @param {Number} year - The year
     * @param {Number} status - The status
     * @returns {Kategori[]} The filtered category demand data
     */
    public async demandKategoriByStatus(year: number, status: number): Promise<DemandKategori[]> {
        let demand_data: DemandInventoryDataDocument = await this.demandFindOne(year);

        let filtered_category_demand_data: DemandKategori[] = demand_data.kategori.filter((category_object) => {
            if (category_object.status == status) {
                return category_object;
            }
        });

        return filtered_category_demand_data;
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
     * @description Update status of category demand data
     * @param {Number} year - The year
     * @param {Number} id - The category demand id
     * @param {Number} status - The The new status
     * @returns {DemandKategori} The updated status of category demand data
     */
    public async demandResponseKategori(
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
     * @description Get every item demand data based on year
     * @param {Number} year - The year data
     * @returns {DemandBarang[]} The item demand data
     */
    public async demandBarangAll(year: number): Promise<DemandBarang[]> {
        return (await this.demandFindOne(year)).barang;
    }

    /**
     * @description  Get item demand data based on year and id
     * @param {Number} year - The year
     * @param {Number} id - The item demand id
     * @returns {DemandBarang} The item demand data
     */
    public async demandBarangById(year: number, id: number): Promise<DemandBarang> {
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
     * @description Filter item demand data based on status
     * @param {Number} year - The year
     * @param {Number} status - The status
     * @returns {DemandBarang[]} The filtered item demand data
     */
    public async demandBarangByStatus(year: number, status: number): Promise<DemandBarang[]> {
        let demand_data: DemandInventoryDataDocument = await this.demandFindOne(year);

        let filtered_item_demand_data: DemandBarang[] = demand_data.barang.filter((item_object) => {
            if (item_object.status == status) {
                return item_object;
            }
        });

        return filtered_item_demand_data;
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
     * @description Update status of item demand data
     * @param {Number} year - The year
     * @param {Number} id - The item demand id
     * @param {Number} status - The The new status
     * @returns {DemandBarang} The updated status of item demand data
     */
    public async demandResponseBarang(year: number, id: number, status: number): Promise<DemandBarang | HttpException> {
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

    //#endregion demand
}
