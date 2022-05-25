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

import { InventoryData, InventoryDataDocument } from "./schema/inventory.schema";

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
    constructor(@InjectModel(InventoryData.name) private readonly inventoryDataModel: Model<InventoryDataDocument>) {}

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
     * @description Find item length based on year and category
     * @param {Number} year - The year
     * @param {Category} category - The category
     * @returns {Number} The item length data
     */
    public async findItemLengthByYearAndCategory(year: number, category: string): Promise<number> {
        let inventory_data = await this.findOne(year);
        let item_length: number;

        inventory_data.inventory.filter((inventory_dict) => {
            if (inventory_dict.kategori == category) {
                item_length = inventory_dict.barang.length;
            }
        });

        return item_length;
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
     * @description Create a new category then add based on year
     * @param {Number} year - The year
     * @param {String} category - The category
     * @returns {ResponseCreateItemDto} The new item data
     */
    public async createKategori(year: number, category: string): Promise<ResponseCreateCategoryDto> {
        let inventory_data: InventoryDataDocument = await this.findOne(year);
        let new_category: ResponseCreateCategoryDto = {
            id: (await this.findCategoryLengthByYear(year)) + 1,
            kategori: category,
            barang: [],
        };

        inventory_data.inventory.push(new_category);

        this.inventoryDataModel.replaceOne({ tahun: year }, inventory_data, { upsert: true }).exec();

        return new_category;
    }

    /**
     * @description Create a new item then add based on year and category
     * @param {Number} year - The year
     * @param {String} category -The category
     * @param {ResponseCreateItemDto} item_data - The data required
     * @returns {ResponseCreateItemDto} The new item data
     */
    public async createBarang(
        year: number,
        category: string,
        item_data: ResponseCreateItemDto
    ): Promise<ResponseCreateItemDto> {
        let inventory_data: InventoryDataDocument = await this.findOne(year);
        let new_item: ResponseCreateItemDto;

        inventory_data.inventory.forEach((category_object) => {
            if (category_object.kategori == category) {
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
            }
        });

        this.inventoryDataModel.replaceOne({ tahun: year }, inventory_data, { upsert: true }).exec();

        return new_item;
    }

    /**
     * @description Delete category data based on year and id
     * @param {Number} year - The year
     * @param {Number} id - The category id
     * @returns {ResponseDeleteCategoryDto} The deleted category data
     */
    public async deleteKategori(year: number, id: number): Promise<ResponseDeleteCategoryDto> {
        let inventory_data: InventoryDataDocument = await this.findOne(year);
        let deleted_category: ResponseDeleteCategoryDto;

        inventory_data.inventory.forEach((category_object, index) => {
            if (category_object.id == id) {
                deleted_category = category_object;
                inventory_data.inventory.splice(index, 1);
            }
        });

        this.inventoryDataModel.replaceOne({ tahun: year }, inventory_data, { upsert: true }).exec();

        return deleted_category;
    }
}
