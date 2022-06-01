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

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
    MasterBarang,
    MasterInventory,
    MasterInventoryData,
    MasterInventoryDataDocument,
} from "./schema/master-inventory.schema";

/**
 * @class MasterInventoryService
 * @description The master inventory service.
 */
@Injectable()
export class MasterInventoryService {
    /**
     * @constructor
     * @description Creates a new inventory data service.
     * @param {Model} masterInventoryDataModel - The data model.
     */
    constructor(
        @InjectModel(MasterInventoryData.name) private readonly masterInventoryDataModel: Model<MasterInventoryDataDocument>
    ) {}

    //#region main

    /**
     * @description Finds all inventory data.
     * @returns {Promise<MasterInventoryDataDocument[]>} The data.
     */
    public async findAll(): Promise<MasterInventoryDataDocument[]> {
        return this.masterInventoryDataModel.find().exec();
    }

    /**
     * @description Finds a inventory data by its year.
     * @param {Number} year - The year.
     * @returns {Promise<MasterInventoryDataDocument>}
     */
    public async findOne(year: number): Promise<MasterInventoryDataDocument> {
        return this.masterInventoryDataModel.findOne({ year }).exec();
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
     * @description Get a new category id that hasn't been used yet by other inventory objects
     * @param {Number} year - The year
     * @returns {Number} The new category id
     */
    public async getNewCategoryId(year: number): Promise<number> {
        let category_length: number = await this.findCategoryLengthByYear(year);
        let inventory_data: MasterInventoryDataDocument = await this.findOne(year);
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
     * @description Get a new item id that hasn't been used yet by other item objects
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @returns {Number} The new item id
     */
    public async getNewItemId(year: number, category_id: number): Promise<number> {
        let category_length: number = await this.findCategoryLengthByYear(year);
        let item_length: number = await this.findItemLengthByYearAndCategoryId(year, category_id);
        let inventory_data: MasterInventoryDataDocument = await this.findOne(year);
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

    //#region master

    /**
     * @description Get category data based on year and category id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @returns {MasterInventory} The category data
     */
    public async masterGetKategoriByKategoriId(year: number, category_id: number): Promise<MasterInventory> {
        let inventory_data: MasterInventoryDataDocument = await this.findOne(year);
        let category_data: MasterInventory;

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
     * @returns {MasterBarang} The item data
     */
    public async masterGetBarangByKategoriIdAndBarangId(
        year: number,
        category_id: number,
        item_id: number
    ): Promise<MasterBarang> {
        let inventory_data: MasterInventoryDataDocument = await this.findOne(year);
        let item_data: MasterBarang;

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
     * @returns {MasterInventory} The new category data
     */
    public async masterCreateKategori(year: number, category: string): Promise<MasterInventory> {
        let inventory_data: MasterInventoryDataDocument = await this.findOne(year);
        let new_category: MasterInventory = {
            id: await this.getNewCategoryId(year),
            kategori: category,
            barang: [],
        };

        inventory_data.inventory.push(new_category);
        inventory_data.inventory.sort((a: MasterInventory, b: MasterInventory) => a.id - b.id);

        this.masterInventoryDataModel.replaceOne({ tahun: year }, inventory_data, { upsert: true }).exec();

        return new_category;
    }

    /**
     * @description Create a new item then add based on year and category id
     * @param {Number} year - The year
     * @param {Number} category_id -The category id
     * @param {MasterBarang} item_data - The data required
     * @returns {MasterBarang} The new item data
     */
    public async masterCreateBarang(year: number, category_id: number, item_data: MasterBarang): Promise<MasterBarang> {
        let inventory_data: MasterInventoryDataDocument = await this.findOne(year);
        let new_item: MasterBarang;

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
                category_object.barang.sort((a: MasterBarang, b: MasterBarang) => a.id - b.id);
            }
        });

        this.masterInventoryDataModel.replaceOne({ tahun: year }, inventory_data, { upsert: true }).exec();

        return new_item;
    }

    /**
     * @description Update category data based on year and category id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @param {String} category_name - The new category name
     * @returns {MasterInventory} The updated category data
     */
    public async masterUpdateKategoriByKategoriId(
        year: number,
        category_id: number,
        category_name: string
    ): Promise<MasterInventory> {
        let inventory_data: MasterInventoryDataDocument = await this.findOne(year);
        let updated_category_data: MasterInventory;

        inventory_data.inventory.forEach((category_object) => {
            if (category_object.id == category_id) {
                category_object.kategori = category_name;

                updated_category_data = category_object;
            }
        });

        this.masterInventoryDataModel.replaceOne({ tahun: year }, inventory_data, { upsert: true }).exec();

        return updated_category_data;
    }

    /**
     * @description Update item data based on year, category id and item id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @param {MasterBarang} item_data - The new item data
     * @returns {MasterBarang} The Updated item data
     */
    public async masterUpdateBarangByKategoriIdAndBarangId(
        year: number,
        category_id: number,
        item_id: number,
        item_data: MasterBarang
    ): Promise<MasterBarang> {
        let inventory_data: MasterInventoryDataDocument = await this.findOne(year);
        let updated_item_data: MasterBarang;

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

        this.masterInventoryDataModel.replaceOne({ tahun: year }, inventory_data, { upsert: true }).exec();

        return updated_item_data;
    }

    /**
     * @description Delete category data based on year and category id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @returns {MasterInventory} The deleted category data
     */
    public async masterDeleteKategoriByKategoriId(year: number, category_id: number): Promise<MasterInventory> {
        let inventory_data: MasterInventoryDataDocument = await this.findOne(year);
        let deleted_category: MasterInventory;

        inventory_data.inventory.forEach((category_object, index) => {
            if (category_object.id == category_id) {
                deleted_category = category_object;
                inventory_data.inventory.splice(index, 1);
            }
        });

        this.masterInventoryDataModel.replaceOne({ tahun: year }, inventory_data, { upsert: true }).exec();

        return deleted_category;
    }

    /**
     * @description Delete item data based on year, category id and item id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @returns {MasterBarang} The deleted item data
     */
    public async masterDeleteBarangByKategoriIdAndBarangId(
        year: number,
        category_id: number,
        item_id: number
    ): Promise<MasterBarang> {
        let inventory_data: MasterInventoryDataDocument = await this.findOne(year);
        let deleted_item: MasterBarang;

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

        this.masterInventoryDataModel.replaceOne({ tahun: year }, inventory_data, { upsert: true }).exec();

        return deleted_item;
    }

    //#endregion master
}
