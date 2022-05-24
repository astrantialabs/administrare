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
import { ResCreateItemDto } from "./dto/create-item.schema";

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
                item_length = inventory_dict.barang.length + 1;
            }
        });

        return item_length;
    }

    /**
     * @description Create a new item then add based on year and category
     * @param {Number} year - The year
     * @param {String} category -The category
     * @param {ResCreateItemDto} item_data - The data required
     * @returns {ResCreateItemDto} The new item data
     */
    public async createBarang(year: number, category: string, item_data: ResCreateItemDto): Promise<ResCreateItemDto> {
        let inventory_data = await this.findOne(year);
        let new_item: ResCreateItemDto;

        inventory_data.inventory.filter((inventory_dict) => {
            if (inventory_dict.kategori == category) {
                new_item = {
                    id: item_data.id,
                    nama: item_data.nama,
                    satuan: item_data.satuan,
                    saldo: item_data.saldo,
                    mutasi_barang_masuk: item_data.mutasi_barang_masuk,
                    mutasi_barang_keluar: item_data.mutasi_barang_keluar,
                    saldo_akhir: item_data.saldo_akhir,
                };

                inventory_dict.barang.push(new_item);
            }

            return inventory_dict;
        });

        this.inventoryDataModel.replaceOne({ tahun: year }, inventory_data, { upsert: true }).exec();

        return new_item;
    }

    public async createKategori(data: any): Promise<any> {
        let inventory_data = await this.findOne(data.tahun);
        let new_category = {
            id: inventory_data.inventory.length + 1,
            kategori: data.kategori,
            barang: data.barang,
        };

        inventory_data.inventory.push(new_category);

        this.inventoryDataModel.replaceOne({ tahun: data.tahun }, inventory_data, { upsert: true }).exec();

        return new_category;
    }
}
