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
 * @fileoverview The master inventory service.
 * @author Rizky Irswanda <rizky.irswanda115@gmail.com>
 */

import { UtilsService } from "@/server/utils/utils.service";
import { ItemSearchData, JumlahData } from "@/shared/typings/types/inventory";
import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ParameterMasterUpdateItemDto } from "./dto/item.schema";
import {
    MasterBarang,
    MasterKategori,
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
     * @param {UtilsService} utilsService - The utils service
     */
    constructor(
        @InjectModel(MasterInventoryData.name)
        private readonly masterInventoryDataModel: Model<MasterInventoryDataDocument>,
        private readonly utilsService: UtilsService
    ) {}

    //#region main

    /**
     * @description Find an inventory document based on year
     * @param {Number} year - The year
     * @returns {Promise<MasterInventoryDataDocument>} The inventory document
     */
    public async masterFindOne(year: number): Promise<MasterInventoryDataDocument> {
        return await this.masterInventoryDataModel.findOne({ tahun: year }).exec();
    }

    //#endregion main

    //#region utility

    /**
     * @description Get the length of kategori
     * @param {Number} year - The year
     * @returns {Promise<Number>} Return the length of kategori
     */
    public async masterGetKategoriLength(year: number): Promise<number> {
        return (await this.masterGetKategoriAll(year)).length;
    }

    /**
     * @description Get the length of barang based on category id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @returns {Promise<Number>} Return the length of barang
     */
    public async masterGetBarangLengthByKategoriId(year: number, category_id: number): Promise<number> {
        return (await this.masterGetBarangAllByKategoriId(year, category_id)).length;
    }

    /**
     * @description Get a new kategori id
     * @param {Number} year - The year
     * @returns {Promise<Number>} Return a new kategori id
     */
    public async masterGetNewKategoriId(year: number): Promise<number> {
        const master_kategori_data: MasterKategori[] = await this.masterGetKategoriAll(year);
        let kategori_length: number = await this.masterGetKategoriLength(year);
        let new_kategori_id: number = kategori_length + 1;

        for (let i = 0; i < kategori_length; i++) {
            if (master_kategori_data[i].id != i + 1) {
                new_kategori_id = i + 1;

                break;
            }
        }

        return new_kategori_id;
    }

    /**
     * @description Get a new barang id based on category id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @returns {Promise<Number>} Return a new barang id
     */
    public async masterGetNewBarangIdByKategoriId(year: number, category_id: number): Promise<number> {
        const master_barang_data: MasterBarang[] = await this.masterGetBarangAllByKategoriId(year, category_id);
        let barang_length: number = await this.masterGetBarangLengthByKategoriId(year, category_id);
        let new_barang_id: number = barang_length + 1;

        for (let i = 0; i < barang_length; i++) {
            if (master_barang_data[i].id != i + 1) {
                new_barang_id = i + 1;

                break;
            }
        }

        return new_barang_id;
    }

    /**
     * @description Get saldo_akhir_jumlah_satuan and jumlah_permintaan based on category id and item id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The  item id
     * @returns {JumlahData} Return jumlah data
     */
    public async masterGetSaldoAkhirAndPermintaanByKategoriIdAndBarangId(
        year: number,
        category_id: number,
        item_id: number
    ): Promise<JumlahData> {
        let master_barang_object: MasterBarang = await this.masterGetBarangByKategoriIdAndBarangId(
            year,
            category_id,
            item_id
        );

        let jumlah_data: JumlahData = {
            saldo_akhir: master_barang_object.saldo_akhir_jumlah_satuan,
            permintaan: master_barang_object.jumlah_permintaan,
        };

        return jumlah_data;
    }

    /**
     * @description Increase jumlah_permintaan based on category id and item id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @param {Number} total - The amount of jumlah_permintaan will be increase
     * @returns {MasterBarang} The updated barang object
     */
    public async masterIncreaseJumlahPermintaanByKategoriIdAndBarangId(
        year: number,
        category_id: number,
        item_id: number,
        total: number
    ) {
        let master_inventory_data: MasterInventoryDataDocument = await this.masterFindOne(year);
        let updated_item_object: MasterBarang;

        master_inventory_data.kategori.forEach((category_object) => {
            if (category_object.id == category_id) {
                category_object.barang.forEach((item_object) => {
                    if (item_object.id == item_id) {
                        item_object.jumlah_permintaan += total;

                        updated_item_object = item_object;
                    }
                });
            }
        });

        this.masterInventoryDataModel.replaceOne({ tahun: year }, master_inventory_data, { upsert: true }).exec();

        return updated_item_object;
    }

    /**
     * @description Response item jumlah_permintaan by category id and item id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @param {Number} total - The total
     * @param {Number} status - The status
     */
    public async masterResponseJumlahPermintaanByKategoriIdAndBarangId(
        year: number,
        category_id: number,
        item_id: number,
        total: number,
        status: number
    ) {
        let master_inventory_data: MasterInventoryDataDocument = await this.masterFindOne(year);

        master_inventory_data.kategori.forEach((master_category_object) => {
            if (master_category_object.id == category_id) {
                master_category_object.barang.forEach((master_item_object) => {
                    if (master_item_object.id == item_id) {
                        if (status == 1) {
                            master_item_object.mutasi_barang_keluar_jumlah_satuan += total;

                            master_item_object.jumlah_permintaan -= total;

                            master_item_object.saldo_akhir_jumlah_satuan =
                                this.utilsService.calculateSaldoAkhirJumlahSatuan(
                                    master_item_object.saldo_jumlah_satuan,
                                    master_item_object.mutasi_barang_masuk_jumlah_satuan,
                                    master_item_object.mutasi_barang_keluar_jumlah_satuan
                                );
                        } else if (status == 2) {
                            master_item_object.jumlah_permintaan -= total;
                        }
                    }
                });
            }
        });

        this.masterInventoryDataModel.replaceOne({ tahun: year }, master_inventory_data, { upsert: true }).exec();
    }

    /**
     * @description Search items based on name
     * @param {Number} year - The year
     * @param {String} name - The name
     * @returns {Promise<ItemSearchData[]>} Return filtered items
     */
    public async masterSearchBarangByName(year: number, name: string): Promise<ItemSearchData[]> {
        let master_inventory_data: MasterInventoryDataDocument = await this.masterFindOne(year);
        let item_search_data: ItemSearchData[] = [];
        let search_array: string[] = name.toLowerCase().split("-");

        master_inventory_data.kategori.forEach((category_object) => {
            category_object.barang.forEach((item_object) => {
                let total_match: number = 0;
                search_array.forEach((search_element) => {
                    if (item_object.nama.toLowerCase().includes(search_element)) {
                        total_match += 1;
                    }
                });

                if (total_match > 0) {
                    item_search_data.push({
                        category_id: category_object.id,
                        category_name: category_object.kategori,
                        item_id: item_object.id,
                        item_name: item_object.nama,
                        total_match: total_match,
                    });
                }
            });
        });

        item_search_data.sort((a: ItemSearchData, b: ItemSearchData) => b.total_match - a.total_match);

        return item_search_data;
    }

    //#endregion utility

    //#region crud

    /**
     * @description Get all kategori object
     * @param {Number} year - The year
     * @returns {Promise<MasterKategori[]>} return all kategori object
     */
    public async masterGetKategoriAll(year: number): Promise<MasterKategori[]> {
        return (await this.masterFindOne(year)).kategori;
    }

    /**
     * @description Get all barang object based on category id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @returns {Promise<MasterBarang[]>} return all barang object
     */
    public async masterGetBarangAllByKategoriId(year: number, category_id: number): Promise<MasterBarang[]> {
        return (await this.masterGetKategoriByKategoriId(year, category_id)).barang;
    }

    /**
     * @description Get kategori object based on category id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @returns {Promise<MasterKategori>} return kategori object
     */
    public async masterGetKategoriByKategoriId(year: number, category_id: number): Promise<MasterKategori> {
        const master_kategori_data: MasterKategori[] = await this.masterGetKategoriAll(year);
        let master_kategori: MasterKategori;

        master_kategori_data.forEach((category_object) => {
            if (category_object.id == category_id) {
                master_kategori = category_object;
            }
        });

        return master_kategori;
    }

    /**
     * @description Get barang object based on category id and item id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @returns {Promise<MasterBarang>} Return barang object
     */
    public async masterGetBarangByKategoriIdAndBarangId(
        year: number,
        category_id: number,
        item_id: number
    ): Promise<MasterBarang> {
        const master_barang_data: MasterBarang[] = await this.masterGetBarangAllByKategoriId(year, category_id);
        let master_barang: MasterBarang;

        master_barang_data.forEach((item_object) => {
            if (item_object.id == item_id) {
                master_barang = item_object;
            }
        });

        return master_barang;
    }

    public async masterGetKategoriNameByKategoriId(year: number, category_id: number): Promise<string> {
        return (await this.masterGetKategoriByKategoriId(year, category_id)).kategori;
    }

    public async masterGetBarangNameByKategoriIdAndBarangId(
        year: number,
        category_id: number,
        item_id: number
    ): Promise<string> {
        return (await this.masterGetBarangByKategoriIdAndBarangId(year, category_id, item_id)).nama;
    }

    /**
     * @description Create a new kategori object
     * @param {Number} year - The year
     * @param {Number} kategori - The new kategori
     * @returns {Promise<MasterKategori>} Return the new kategori object
     */
    public async masterCreateKategori(year: number, category: MasterKategori): Promise<MasterKategori> {
        let master_inventory_data: MasterInventoryDataDocument = await this.masterFindOne(year);

        master_inventory_data.kategori.push(category);
        master_inventory_data.kategori.sort((a: MasterKategori, b: MasterKategori) => a.id - b.id);

        this.masterInventoryDataModel.replaceOne({ tahun: year }, master_inventory_data, { upsert: true }).exec();

        return category;
    }

    /**
     * @description Create a new barang object
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @param {MasterBarang} item - The new barang object
     * @returns {Promise<MasterBarang>} Return the new barang object
     */
    public async masterCreateBarang(year: number, category_id: number, item: MasterBarang): Promise<MasterBarang> {
        let master_inventory_data: MasterInventoryDataDocument = await this.masterFindOne(year);

        master_inventory_data.kategori.forEach((category_object) => {
            if (category_object.id == category_id) {
                category_object.barang.push(item);
                category_object.barang.sort((a: MasterBarang, b: MasterBarang) => a.id - b.id);
            }
        });

        this.masterInventoryDataModel.replaceOne({ tahun: year }, master_inventory_data, { upsert: true }).exec();

        return item;
    }

    /**
     * @description Update kategori object based on category id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @param {String} category - The category
     * @returns {Promise<MasterKategori>} Return the updated kategori object
     */
    public async masterUpdateKategoriByKategoriId(
        year: number,
        category_id: number,
        category: string
    ): Promise<MasterKategori> {
        let master_inventory_data: MasterInventoryDataDocument = await this.masterFindOne(year);
        let updated_category_object: MasterKategori;

        master_inventory_data.kategori.forEach((category_object) => {
            if (category_object.id == category_id) {
                category_object.kategori = category;
                category_object.updated_at = this.utilsService.currentDate();

                updated_category_object = category_object;
            }
        });

        this.masterInventoryDataModel.replaceOne({ tahun: year }, master_inventory_data, { upsert: true }).exec();

        return updated_category_object;
    }

    /**
     * @description Update barang object based on category id and item item id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @param {ParameterMasterUpdateItemDto} barang - The barang data
     * @returns {Promise<MasterBarang>} Return the updated barang object
     */
    public async masterUpdateBarangByKategoriIdAndItemId(
        year: number,
        category_id: number,
        item_id: number,
        barang: ParameterMasterUpdateItemDto
    ): Promise<MasterBarang> {
        let master_inventory_data: MasterInventoryDataDocument = await this.masterFindOne(year);
        let updated_item_object: MasterBarang;

        master_inventory_data.kategori.forEach((category_object) => {
            if (category_object.id == category_id) {
                category_object.barang.forEach((item_object) => {
                    if (item_object.id == item_id) {
                        item_object.nama = barang.nama;
                        item_object.satuan = barang.satuan;
                        item_object.updated_at = this.utilsService.currentDate();
                        item_object.saldo_jumlah_satuan = barang.saldo_jumlah_satuan;
                        item_object.mutasi_barang_masuk_jumlah_satuan = barang.mutasi_barang_masuk_jumlah_satuan;
                        item_object.mutasi_barang_keluar_jumlah_satuan = barang.mutasi_barang_keluar_jumlah_satuan;
                        item_object.saldo_akhir_jumlah_satuan = this.utilsService.calculateSaldoAkhirJumlahSatuan(
                            barang.saldo_jumlah_satuan,
                            barang.mutasi_barang_masuk_jumlah_satuan,
                            barang.mutasi_barang_keluar_jumlah_satuan
                        );
                        item_object.harga_satuan = barang.harga_satuan;
                        item_object.keterangan = barang.keterangan;

                        updated_item_object = item_object;
                    }
                });
            }
        });

        this.masterInventoryDataModel.replaceOne({ tahun: year }, master_inventory_data, { upsert: true }).exec();

        return updated_item_object;
    }

    /**
     * @description Delete kategori object based on category id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @returns {Promise<MasterKategori>} Return the deleted kategori object
     */
    public async masterDeleteKategoriByKategoriId(year: number, category_id: number): Promise<MasterKategori> {
        let master_inventory_data: MasterInventoryDataDocument = await this.masterFindOne(year);
        let deleted_category_object: MasterKategori;

        master_inventory_data.kategori.forEach((category_object, index) => {
            if (category_object.id == category_id) {
                let deletion_is_valid: boolean = true;
                category_object.barang.forEach((item_object) => {
                    if (item_object.jumlah_permintaan > 0) {
                        deletion_is_valid = false;
                    }
                });

                if (deletion_is_valid) {
                    deleted_category_object = category_object;

                    master_inventory_data.kategori.splice(index, 1);
                } else if (!deletion_is_valid) {
                    return new HttpException(
                        "jumlah permintaan of items in category needs to be 0",
                        HttpStatus.BAD_GATEWAY
                    );
                }
            }
        });

        this.masterInventoryDataModel.replaceOne({ tahun: year }, master_inventory_data, { upsert: true }).exec();

        return deleted_category_object;
    }

    /**
     * @description Delete barang object based on category id and item id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @returns {Promise<MasterBarang>} Return the deleted barang object
     */
    public async masterDeleteBarangByKategoriIdAndBarangId(
        year: number,
        category_id: number,
        item_id: number
    ): Promise<MasterBarang> {
        let master_inventory_data: MasterInventoryDataDocument = await this.masterFindOne(year);
        let deleted_item_object: MasterBarang;

        master_inventory_data.kategori.forEach((category_object) => {
            if (category_object.id == category_id) {
                category_object.barang.forEach((item_object, index) => {
                    if (item_object.id == item_id) {
                        if (item_object.jumlah_permintaan == 0) {
                            deleted_item_object = item_object;

                            category_object.barang.splice(index, 1);
                        } else if (item_object.jumlah_permintaan != 0) {
                            return new HttpException("jumlah permintaan of item needs to be 0", HttpStatus.BAD_GATEWAY);
                        }
                    }
                });
            }
        });

        this.masterInventoryDataModel.replaceOne({ tahun: year }, master_inventory_data, { upsert: true }).exec();

        return deleted_item_object;
    }

    //#endregion crud
}
