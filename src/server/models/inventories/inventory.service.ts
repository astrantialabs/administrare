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

import { ResponseCreateCategoryDto } from "./dto/category/create-category.schema";
import { ResponseDeleteCategoryDto } from "./dto/category/delete-category.schema";
import { ResponseCreateItemDto } from "./dto/item/create-item.schema";
import { ResponseDeleteItemDto } from "./dto/item/delete.item.schema";
import { Barang, Inventory, InventoryData, InventoryDataDocument } from "./schema/inventory.schema";
import { DemandInventoryData, DemandInventoryDataDocument } from "./schema/demand-inventory";
import { ResponseDemandCategoryDto } from "./dto/category/demand-category.schema";

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

    /**
     * @description Create a new category then add based on year
     * @param {Number} year - The year
     * @param {String} category - The category
     * @returns {ResponseCreateItemDto} The new item data
     */
    public async createKategori(year: number, category: string): Promise<ResponseCreateCategoryDto> {
        let inventory_data: InventoryDataDocument = await this.findOne(year);
        let new_category: ResponseCreateCategoryDto = {
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
     * @param {ResponseCreateItemDto} item_data - The data required
     * @returns {ResponseCreateItemDto} The new item data
     */
    public async createBarang(
        year: number,
        category_id: number,
        item_data: ResponseCreateItemDto
    ): Promise<ResponseCreateItemDto> {
        let inventory_data: InventoryDataDocument = await this.findOne(year);
        let new_item: ResponseCreateItemDto;

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
     * @description Delete category data based on year and category id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @returns {ResponseDeleteCategoryDto} The deleted category data
     */
    public async deleteKategori(year: number, category_id: number): Promise<ResponseDeleteCategoryDto> {
        let inventory_data: InventoryDataDocument = await this.findOne(year);
        let deleted_category: ResponseDeleteCategoryDto;

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
     * @description Deleter item data based on year, category id and item id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @returns {ResponseDeleteItemDto} The deleted item data
     */
    public async deleteBarang(year: number, category_id: number, item_id: number): Promise<ResponseDeleteItemDto> {
        let inventory_data: InventoryDataDocument = await this.findOne(year);
        let deleted_item: ResponseDeleteItemDto;

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

    /**
     * @description Find demand data based on year
     * @param {Number} year - The year
     * @returns {DemandInventoryDataDocument} The demand data
     */
    public async demandFindOne(year: number): Promise<DemandInventoryDataDocument> {
        return await this.demandInventoryDataModel.findOne({ tahun: year }).exec();
    }

    /**
     * @description Create a new category demand then add based on year
     * @param {Number} year - The year
     * @param {String} category - The new category name
     * @returns {ResponseDemandCategoryDto} The new demanded category data
     */
    public async demandCreateKategori(year: number, category: string): Promise<ResponseDemandCategoryDto> {
        let demand_data: DemandInventoryDataDocument = await this.demandFindOne(year);

        let new_category_demand: ResponseDemandCategoryDto = {
            id: demand_data.kategori.length + 1,
            kategori: category,
            status: 0,
        };

        demand_data.kategori.push(new_category_demand);

        this.demandInventoryDataModel.replaceOne({ tahun: year }, demand_data, { upsert: true }).exec();

        return new_category_demand;
    }
}
