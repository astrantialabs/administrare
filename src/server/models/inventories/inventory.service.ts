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

import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UpdateInventoryDto } from "./dto/update-inventory.schema";

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
     * @description Create a new inventory data.
     * @param {Number} year - The year.
     * @returns {Promise<InventoryDataDocument>}
     */
    public async createBarang(year: number, data: any): Promise<any> {
        let inventory_data = await this.findOne(year);
        let new_item;
        inventory_data.inventory = inventory_data.inventory.filter((inventory_dict) => {
            if (inventory_dict.kategori == data.kategori) {
                new_item = {
                    id: inventory_dict.barang.length + 1,
                    nama: data.nama,
                    satuan: data.satuan,
                    saldo: data.saldo,
                    mutasi_barang_masuk: data.mutasi_barang_masuk,
                    mutasi_barang_keluar: data.mutasi_barang_keluar,
                    saldo_akhir: data.saldo_akhir,
                };

                inventory_dict.barang.push(new_item);
            }

            return inventory_dict;
        });

        this.inventoryDataModel.replaceOne({ tahun: 2022 }, inventory_data, { upsert: true }).exec();

        return new_item;
    }
}
