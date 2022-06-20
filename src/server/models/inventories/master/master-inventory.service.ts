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
 * @fileoverview The master inventory service.
 * @author Rizky Irswanda <rizky.irswanda115@gmail.com>
 */

import { ResponseFormat } from "@/server/common/interceptors/response-format.interceptor";
import { CategoriesPayload } from "@/shared/typings/interfaces/categories-payload.interface";
import { ResponseObject } from "@/shared/typings/interfaces/inventory.interface";
import { ItemSearchData, JumlahData, MasterParameterBarang, MasterParameterKategori, MasterSubTotal, MasterTotal } from "@/shared/typings/types/inventory";
import { calculateSaldoAkhirJumlahSatuan, currentDate, responseFormat, romanizeNumber } from "@/shared/utils/util";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MasterBarang, MasterKategori, MasterInventoryData, MasterInventoryDataDocument } from "./schema/master-inventory.schema";

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
        @InjectModel(MasterInventoryData.name)
        private readonly masterInventoryDataModel: Model<MasterInventoryDataDocument>
    ) {}

    /* ---------------------------------- MAIN ---------------------------------- */

    /**
     * @description Find an inventory document based on year
     * @param {Number} year - The year
     * @returns {Promise<MasterInventoryDataDocument>} The inventory document
     */
    public async masterFindOne(year: number): Promise<MasterInventoryDataDocument> {
        return await this.masterInventoryDataModel.findOne({ tahun: year }).exec();
    }

    /* --------------------------------- UTILITY -------------------------------- */

    /**
     * @description Get the length of kategori
     * @param {Number} year - The year
     * @returns {Promise<Number>} Return the length of kategori
     */
    public async masterGetKategoriLength(year: number): Promise<number> {
        return (await this.masterGetKategoriAll(year)).result.master_category.length;
    }

    /**
     * @description Get the length of barang based on category id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @returns {Promise<Number>} Return the length of barang
     */
    public async masterGetBarangLengthByKategoriId(year: number, category_id: number): Promise<number> {
        return (await this.masterGetBarangAllByKategoriId(year, category_id)).result.master_item.length;
    }

    /**
     * @description Get a new kategori id
     * @param {Number} year - The year
     * @returns {Promise<Number>} Return a new kategori id
     */
    public async masterGetNewKategoriId(year: number): Promise<number> {
        const master_kategori_data: MasterKategori[] = (await this.masterGetKategoriAll(year)).result.master_category;
        const kategori_length: number = await this.masterGetKategoriLength(year);
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
        const master_barang_data: MasterBarang[] = (await this.masterGetBarangAllByKategoriId(year, category_id)).result.master_item;
        const barang_length: number = await this.masterGetBarangLengthByKategoriId(year, category_id);
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
    public async masterGetSaldoAkhirAndPermintaanByKategoriIdAndBarangId(year: number, category_id: number, item_id: number): Promise<JumlahData> {
        const master_barang_object: MasterBarang = (await this.masterGetBarangByKategoriIdAndBarangId(year, category_id, item_id)).result.master_item;

        const jumlah_data: JumlahData = {
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
    ): Promise<MasterBarang> {
        const master_inventory_data: MasterInventoryDataDocument = await this.masterFindOne(year);
        let updated_item_object: MasterBarang;

        master_inventory_data.kategori.forEach((category_object: MasterKategori) => {
            if (category_object.id == category_id) {
                category_object.barang.forEach((item_object: MasterBarang) => {
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
    ): Promise<void> {
        const master_inventory_data: MasterInventoryDataDocument = await this.masterFindOne(year);

        master_inventory_data.kategori.forEach((master_category_object: MasterKategori) => {
            if (master_category_object.id == category_id) {
                master_category_object.barang.forEach((master_item_object: MasterBarang) => {
                    if (master_item_object.id == item_id) {
                        if (status == 1) {
                            master_item_object.mutasi_barang_keluar_jumlah_satuan += total;

                            master_item_object.jumlah_permintaan -= total;

                            master_item_object.saldo_akhir_jumlah_satuan = calculateSaldoAkhirJumlahSatuan(
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
     * @description Search all items
     * @param {Number} year - The year
     * @returns {Promise<ItemSearchData[]>} Return all items
     */
    public async masterSearchBarangAll(year: number): Promise<ItemSearchData[]> {
        const master_inventory_data: MasterInventoryDataDocument = await this.masterFindOne(year);
        let item_search_data: ItemSearchData[] = [];

        master_inventory_data.kategori.forEach((category_object: MasterKategori) => {
            category_object.barang.forEach((item_object: MasterBarang) => {
                item_search_data.push({
                    category_id: category_object.id,
                    category_name: category_object.kategori,
                    item_id: item_object.id,
                    item_name: item_object.nama,
                    item_unit: item_object.satuan,
                    item_saldo_remainder: item_object.saldo_akhir_jumlah_satuan - item_object.jumlah_permintaan,
                    total_match: 1,
                });
            });
        });

        item_search_data.sort((a: ItemSearchData, b: ItemSearchData) => b.total_match - a.total_match);

        return item_search_data;
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

        master_inventory_data.kategori.forEach((category_object: MasterKategori) => {
            category_object.barang.forEach((item_object: MasterBarang) => {
                let total_match: number = 0;
                search_array.forEach((search_element: string) => {
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
                        item_unit: item_object.satuan,
                        item_saldo_remainder: item_object.saldo_akhir_jumlah_satuan - item_object.jumlah_permintaan,
                        total_match: total_match,
                    });
                }
            });
        });

        item_search_data.sort((a: ItemSearchData, b: ItemSearchData) => b.total_match - a.total_match);

        return item_search_data;
    }

    public async masterGetSubTotal(year: number, category_id: number): Promise<MasterSubTotal> {
        const category_object: MasterKategori = (await this.masterGetKategoriByKategoriId(year, category_id)).result.master_category;

        const sub_total: MasterSubTotal = {
            category_id: category_id,
            saldo: 0,
            mutasi_barang_masuk: 0,
            mutasi_barang_keluar: 0,
            saldo_akhir: 0,
        };

        category_object.barang.forEach((item_object: MasterBarang) => {
            sub_total.saldo += item_object.saldo_jumlah_satuan * item_object.harga_satuan;
            sub_total.mutasi_barang_masuk += item_object.mutasi_barang_masuk_jumlah_satuan * item_object.harga_satuan;
            sub_total.mutasi_barang_keluar += item_object.mutasi_barang_keluar_jumlah_satuan * item_object.harga_satuan;
            sub_total.saldo_akhir += item_object.saldo_akhir_jumlah_satuan * item_object.harga_satuan;
        });

        return sub_total;
    }

    public async masterGetTotal(year: number): Promise<MasterTotal> {
        const category_data: MasterKategori[] = (await this.masterGetKategoriAll(year)).result.master_category;

        const sub_totals: MasterSubTotal[] = await Promise.all(
            category_data.map(async (category_object: MasterKategori) => {
                const sub_total: MasterSubTotal = await this.masterGetSubTotal(year, category_object.id);

                return sub_total;
            })
        );

        const total: MasterTotal = {
            saldo: 0,
            mutasi_barang_masuk: 0,
            mutasi_barang_keluar: 0,
            saldo_akhir: 0,
        };

        sub_totals.forEach((sub_total: MasterSubTotal) => {
            total.saldo += sub_total.saldo;
            total.mutasi_barang_masuk += sub_total.mutasi_barang_masuk;
            total.mutasi_barang_keluar += sub_total.mutasi_barang_keluar;
            total.saldo_akhir += sub_total.saldo_akhir;
        });

        return total;
    }

    /* ---------------------------------- CRUD ---------------------------------- */

    /**
     * @description Get all kategori object
     * @param {Number} year - The year
     * @returns {Promise<MasterKategori[]>} return all kategori object
     */
    public async masterGetKategoriAll(year: number): Promise<ResponseFormat<ResponseObject<MasterKategori[]>>> {
        try {
            return responseFormat<ResponseObject<MasterKategori[]>>(true, 200, `Kategori berhasil ditemukan.`, {
                master_category: (await this.masterFindOne(year)).kategori,
            });
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    /**
     * @description Get all barang object based on category id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @returns {Promise<MasterBarang[]>} return all barang object
     */
    public async masterGetBarangAllByKategoriId(year: number, category_id: number): Promise<ResponseFormat<ResponseObject<MasterBarang[]>>> {
        try {
            const master_kategori: ResponseFormat<ResponseObject<MasterKategori>> = await this.masterGetKategoriByKategoriId(year, category_id);

            if (master_kategori.result) {
                return responseFormat<ResponseObject<MasterBarang[]>>(true, 200, `Barang di dalam kategori dengan id ${category_id} berhasil ditemukan.`, {
                    master_item: master_kategori.result.master_category.barang,
                });
            } else if (!master_kategori.result) {
                return responseFormat<null>(master_kategori.success, master_kategori.statusCode, master_kategori.message, null);
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    /**
     * @description Get kategori object based on category id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @returns {Promise<MasterKategori>} return kategori object
     */
    public async masterGetKategoriByKategoriId(year: number, category_id: number): Promise<ResponseFormat<ResponseObject<MasterKategori>>> {
        try {
            const master_kategori_data: ResponseFormat<ResponseObject<MasterKategori[]>> = await this.masterGetKategoriAll(year);
            if (master_kategori_data.result) {
                let master_kategori: MasterKategori;

                master_kategori_data.result.master_category.forEach((category_object: MasterKategori) => {
                    if (category_object.id == category_id) {
                        master_kategori = category_object;
                    }
                });

                if (master_kategori == undefined) {
                    return responseFormat<null>(false, 400, `Kategori dengan id ${category_id} gagal ditemukan.`, null);
                } else if (master_kategori != undefined) {
                    return responseFormat<ResponseObject<MasterKategori>>(true, 200, `Kategori dengan id ${category_id} berhasil ditemukan.`, {
                        master_category: master_kategori,
                    });
                }
            } else if (!master_kategori_data.result) {
                return responseFormat<null>(master_kategori_data.success, master_kategori_data.statusCode, master_kategori_data.message, null);
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
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
    ): Promise<ResponseFormat<ResponseObject<MasterBarang>>> {
        try {
            const master_barang_data: ResponseFormat<ResponseObject<MasterBarang[]>> = await this.masterGetBarangAllByKategoriId(year, category_id);

            if (master_barang_data.result) {
                let master_barang: MasterBarang;

                master_barang_data.result.master_item.forEach((item_object: MasterBarang) => {
                    if (item_object.id == item_id) {
                        master_barang = item_object;
                    }
                });

                if (master_barang == undefined) {
                    return responseFormat<null>(false, 400, `Barang dengan id ${item_id} di dalam kategori dengan id ${category_id} gagal ditemukan.`, null);
                } else if (master_barang != undefined) {
                    return responseFormat<ResponseObject<MasterBarang>>(
                        true,
                        200,
                        `Barang dengan id ${item_id} di dalam kategori dengan id ${category_id} berhasil ditemukan.`,
                        {
                            master_item: master_barang,
                        }
                    );
                }
            } else if (!master_barang_data.result) {
                return responseFormat<null>(master_barang_data.success, master_barang_data.statusCode, master_barang_data.message, null);
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    public async masterGetKategoriNameByKategoriId(year: number, category_id: number): Promise<ResponseFormat<ResponseObject<string>>> {
        try {
            const master_kategori: ResponseFormat<ResponseObject<MasterKategori>> = await this.masterGetKategoriByKategoriId(year, category_id);

            if (master_kategori.result) {
                return responseFormat<ResponseObject<string>>(true, 200, `Nama kategori dengan id ${category_id} berhasil ditemukan.`, {
                    master_category_name: master_kategori.result.master_category.kategori,
                });
            } else if (!master_kategori.result) {
                return responseFormat<null>(master_kategori.success, master_kategori.statusCode, master_kategori.message, null);
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    public async masterGetBarangNameByKategoriIdAndBarangId(
        year: number,
        category_id: number,
        item_id: number
    ): Promise<ResponseFormat<ResponseObject<string>>> {
        try {
            const master_barang: ResponseFormat<ResponseObject<MasterBarang>> = await this.masterGetBarangByKategoriIdAndBarangId(year, category_id, item_id);

            if (master_barang.result) {
                return responseFormat<ResponseObject<string>>(
                    true,
                    200,
                    `Nama barang dengan id ${item_id} di dalam kategori dengan id ${category_id} berhasil ditemukan.`,
                    {
                        master_item_name: master_barang.result.master_item.nama,
                    }
                );
            } else if (!master_barang.result) {
                return responseFormat<null>(master_barang.success, master_barang.statusCode, master_barang.message, null);
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    /**
     * @description Create a new kategori object
     * @param {Number} year - The year
     * @param {Number} kategori - The new kategori
     * @returns {Promise<MasterKategori>} Return the new kategori object
     */
    public async masterCreateKategori(year: number, body: MasterParameterKategori): Promise<ResponseFormat<ResponseObject<MasterKategori>>> {
        try {
            const category: MasterKategori = {
                id: await this.masterGetNewKategoriId(2022),
                kategori: body.kategori,
                created_at: currentDate(),
                updated_at: currentDate(),
                barang: [],
            };

            const master_inventory_data: MasterInventoryDataDocument = await this.masterFindOne(year);

            master_inventory_data.kategori.push(category);
            master_inventory_data.kategori.sort((a: MasterKategori, b: MasterKategori) => a.id - b.id);

            this.masterInventoryDataModel.replaceOne({ tahun: year }, master_inventory_data, { upsert: true }).exec();

            return responseFormat<ResponseObject<MasterKategori>>(true, 201, `Kategori berhasil dibuat.`, {
                master_category: category,
            });
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    /**
     * @description Create a new barang object
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @param {MasterBarang} item - The new barang object
     * @returns {Promise<MasterBarang>} Return the new barang object
     */
    public async masterCreateBarang(year: number, body: MasterParameterBarang): Promise<ResponseFormat<ResponseObject<MasterBarang>>> {
        try {
            const master_inventory_data: MasterInventoryDataDocument = await this.masterFindOne(year);
            const category_id: number = parseInt(body.kategori_id as unknown as string);

            let category_id_is_valid: boolean = false;
            master_inventory_data.kategori.forEach((category_object: MasterKategori) => {
                if (category_object.id == category_id) {
                    category_id_is_valid = true;
                }
            });

            if (category_id_is_valid) {
                const item: MasterBarang = {
                    id: await this.masterGetNewBarangIdByKategoriId(2022, category_id),
                    nama: body.nama,
                    satuan: body.satuan,
                    created_at: currentDate(),
                    updated_at: currentDate(),
                    saldo_jumlah_satuan: parseInt(body.saldo_jumlah_satuan as unknown as string),
                    mutasi_barang_masuk_jumlah_satuan: parseInt(body.mutasi_barang_masuk_jumlah_satuan as unknown as string),
                    mutasi_barang_keluar_jumlah_satuan: parseInt(body.mutasi_barang_keluar_jumlah_satuan as unknown as string),
                    saldo_akhir_jumlah_satuan: calculateSaldoAkhirJumlahSatuan(
                        parseInt(body.saldo_jumlah_satuan as unknown as string),
                        parseInt(body.mutasi_barang_masuk_jumlah_satuan as unknown as string),
                        parseInt(body.mutasi_barang_keluar_jumlah_satuan as unknown as string)
                    ),
                    jumlah_permintaan: 0,
                    harga_satuan: parseInt(body.harga_satuan as unknown as string),
                    keterangan: body.keterangan,
                };

                master_inventory_data.kategori.forEach((category_object: MasterKategori) => {
                    if (category_object.id == category_id) {
                        category_object.barang.push(item);
                        category_object.barang.sort((a: MasterBarang, b: MasterBarang) => a.id - b.id);

                        this.masterInventoryDataModel.replaceOne({ tahun: year }, master_inventory_data, { upsert: true }).exec();
                    }
                });

                return responseFormat<ResponseObject<MasterBarang>>(true, 201, `Barang di dalam kategori dengan id ${category_id} berhasil dibuat.`, {
                    master_item: item,
                });
            } else if (!category_id_is_valid) {
                return responseFormat<null>(false, 400, `Tidak ada kategori dengan id ${category_id}.`, null);
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
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
        body: MasterParameterKategori
    ): Promise<ResponseFormat<ResponseObject<MasterKategori>>> {
        try {
            const master_inventory_data: MasterInventoryDataDocument = await this.masterFindOne(year);

            let category_id_is_valid: boolean = false;
            master_inventory_data.kategori.forEach((category_object: MasterKategori) => {
                if (category_object.id == category_id) {
                    category_id_is_valid = true;
                }
            });

            if (category_id_is_valid) {
                let updated_category_object: MasterKategori;
                master_inventory_data.kategori.forEach((category_object: MasterKategori) => {
                    if (category_object.id == category_id) {
                        category_object.kategori = body.kategori;
                        category_object.updated_at = currentDate();

                        updated_category_object = category_object;
                        this.masterInventoryDataModel.replaceOne({ tahun: year }, master_inventory_data, { upsert: true }).exec();
                    }
                });

                return responseFormat<ResponseObject<MasterKategori>>(true, 202, `Kategori dengan id ${category_id} berhasil diupdate.`, {
                    master_category: updated_category_object,
                });
            } else if (!category_id_is_valid) {
                return responseFormat<null>(false, 400, `Tidak ada kategori dengan id ${category_id}.`, null);
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
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
        body: MasterParameterBarang
    ): Promise<ResponseFormat<ResponseObject<MasterBarang>>> {
        try {
            const master_inventory_data: MasterInventoryDataDocument = await this.masterFindOne(year);

            let category_id_is_valid: boolean = false;
            let item_id_is_valid: boolean = false;
            master_inventory_data.kategori.forEach((category_object: MasterKategori) => {
                if (category_object.id == category_id) {
                    category_id_is_valid = true;

                    category_object.barang.forEach((item_object: MasterBarang) => {
                        if (item_object.id == item_id) {
                            item_id_is_valid = true;
                        }
                    });
                }
            });

            if (category_id_is_valid) {
                if (item_id_is_valid) {
                    const item: MasterParameterBarang = {
                        kategori_id: category_id,
                        nama: body.nama,
                        satuan: body.satuan,
                        saldo_jumlah_satuan: body.saldo_jumlah_satuan,
                        mutasi_barang_masuk_jumlah_satuan: body.mutasi_barang_masuk_jumlah_satuan,
                        mutasi_barang_keluar_jumlah_satuan: body.mutasi_barang_keluar_jumlah_satuan,
                        harga_satuan: body.harga_satuan,
                        keterangan: body.keterangan,
                    };

                    let updated_item_object: MasterBarang;
                    master_inventory_data.kategori.forEach((category_object: MasterKategori) => {
                        if (category_object.id == category_id) {
                            category_object.barang.forEach((item_object: MasterBarang) => {
                                if (item_object.id == item_id) {
                                    item_object.nama = item.nama;
                                    item_object.satuan = item.satuan;
                                    item_object.updated_at = currentDate();
                                    item_object.saldo_jumlah_satuan = item.saldo_jumlah_satuan;
                                    item_object.mutasi_barang_masuk_jumlah_satuan = item.mutasi_barang_masuk_jumlah_satuan;
                                    item_object.mutasi_barang_keluar_jumlah_satuan = item.mutasi_barang_keluar_jumlah_satuan;
                                    item_object.saldo_akhir_jumlah_satuan = calculateSaldoAkhirJumlahSatuan(
                                        item.saldo_jumlah_satuan,
                                        item.mutasi_barang_masuk_jumlah_satuan,
                                        item.mutasi_barang_keluar_jumlah_satuan
                                    );
                                    item_object.harga_satuan = item.harga_satuan;
                                    item_object.keterangan = item.keterangan;

                                    updated_item_object = item_object;

                                    this.masterInventoryDataModel.replaceOne({ tahun: year }, master_inventory_data, { upsert: true }).exec();
                                }
                            });
                        }
                    });

                    return responseFormat<ResponseObject<MasterBarang>>(
                        true,
                        202,
                        `Barang dengan id ${item_id} di dalam kategori dengan id ${category_id} berhasil diupdate.`,
                        {
                            master_item: updated_item_object,
                        }
                    );
                } else if (!item_id_is_valid) {
                    return responseFormat<null>(false, 400, `Tidak ada barang dengan id ${item_id} di dalam kategori dengan id ${category_id}.`, null);
                }
            } else if (!category_id_is_valid) {
                return responseFormat<null>(false, 400, `Tidak ada kategori dengan id ${category_id}.`, null);
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    /**
     * @description Delete kategori object based on category id
     * @param {Number} year - The year
     * @param {Number} category_id - The category id
     * @returns {Promise<MasterKategori>} Return the deleted kategori object
     */
    public async masterDeleteKategoriByKategoriId(year: number, category_id: number): Promise<ResponseFormat<ResponseObject<MasterKategori>>> {
        try {
            const master_inventory_data: MasterInventoryDataDocument = await this.masterFindOne(year);

            let category_id_is_valid: boolean = false;
            master_inventory_data.kategori.forEach((category_object: MasterKategori) => {
                if (category_object.id == category_id) {
                    category_id_is_valid = true;
                }
            });

            if (category_id_is_valid) {
                let deletion_is_valid: boolean = true;
                master_inventory_data.kategori.forEach((category_object: MasterKategori) => {
                    if (category_object.id == category_id) {
                        category_object.barang.forEach((item_object) => {
                            if (item_object.jumlah_permintaan > 0) {
                                deletion_is_valid = false;
                            }
                        });
                    }
                });

                if (deletion_is_valid) {
                    let deleted_category_object: MasterKategori;
                    master_inventory_data.kategori.forEach((category_object: MasterKategori, index: number) => {
                        if (category_object.id == category_id) {
                            deleted_category_object = category_object;

                            master_inventory_data.kategori.splice(index, 1);

                            this.masterInventoryDataModel.replaceOne({ tahun: year }, master_inventory_data, { upsert: true }).exec();
                        }
                    });

                    return responseFormat<ResponseObject<MasterKategori>>(true, 202, `Kategori dengan id ${category_id} berhasil dihapus.`, {
                        master_category: deleted_category_object,
                    });
                } else if (!deletion_is_valid) {
                    return responseFormat<null>(false, 400, `Jumlah permintaan barang-barang di dalam kategori dengan id ${category_id} harus 0.`, null);
                }
            } else if (!category_id_is_valid) {
                return responseFormat<null>(false, 400, `Tidak ada kategori dengan id ${category_id}.`, null);
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
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
    ): Promise<ResponseFormat<ResponseObject<MasterBarang>>> {
        try {
            const master_inventory_data: MasterInventoryDataDocument = await this.masterFindOne(year);

            let category_id_is_valid: boolean = false;
            let item_id_is_valid: boolean = false;
            master_inventory_data.kategori.forEach((category_object: MasterKategori) => {
                if (category_object.id == category_id) {
                    category_id_is_valid = true;

                    category_object.barang.forEach((item_object: MasterBarang) => {
                        if (item_object.id == item_id) {
                            item_id_is_valid = true;
                        }
                    });
                }
            });

            if (category_id_is_valid) {
                if (item_id_is_valid) {
                    let deletion_is_valid: boolean = true;
                    master_inventory_data.kategori.forEach((category_object: MasterKategori) => {
                        if (category_object.id == category_id) {
                            category_object.barang.forEach((item_object) => {
                                if (item_object.id == item_id) {
                                    if (item_object.jumlah_permintaan > 0) {
                                        deletion_is_valid = false;
                                    }
                                }
                            });
                        }
                    });

                    if (deletion_is_valid) {
                        let deleted_item_object: MasterBarang;

                        master_inventory_data.kategori.forEach((category_object) => {
                            if (category_object.id == category_id) {
                                category_object.barang.forEach((item_object, index) => {
                                    if (item_object.id == item_id) {
                                        deleted_item_object = item_object;

                                        category_object.barang.splice(index, 1);

                                        this.masterInventoryDataModel.replaceOne({ tahun: year }, master_inventory_data, { upsert: true }).exec();
                                    }
                                });
                            }
                        });

                        return responseFormat<ResponseObject<MasterBarang>>(
                            true,
                            202,
                            `Barang dengan id ${item_id} di dalam kategori dengan id ${category_id} berhasil dihapus.`,
                            {
                                master_category: deleted_item_object,
                            }
                        );
                    } else if (!deletion_is_valid) {
                        return responseFormat<null>(
                            false,
                            400,
                            `Jumlah permintaan barang dengan id ${item_id} di dalam kategori dengan id ${category_id} harus 0.`,
                            null
                        );
                    }
                } else if (!item_id_is_valid) {
                    return responseFormat<null>(false, 400, `Tidak ada barang dengan id ${item_id} di dalam kategori dengan id ${category_id}.`, null);
                }
            } else if (!category_id_is_valid) {
                return responseFormat<null>(false, 400, `Tidak ada kategori dengan id ${category_id}.`, null);
            }
        } catch (error: any) {
            return responseFormat<null>(false, 500, error.message, null);
        }
    }

    /* ---------------------------------- TABLE --------------------------------- */

    public async masterTableGetKategoriAll(year: number): Promise<any> {
        const master_kategori_data: MasterKategori[] = (await this.masterGetKategoriAll(year)).result.master_category;
        const categories: CategoriesPayload[] = [];

        master_kategori_data.forEach(async (category_object, index) => {
            categories.push({
                id: category_object.id,
                name: category_object.kategori,
                roman: await romanizeNumber(index + 1),
            });
        });

        return categories;
    }

    public async masterTableGetAll(): Promise<any> {
        const master_inventory_data: MasterInventoryDataDocument = await this.masterFindOne(2022);
        let table_data: any[] = [];

        const sub_totals: MasterSubTotal[] = await Promise.all(
            master_inventory_data.kategori.map(async (category_object: MasterKategori) => {
                const sub_total: MasterSubTotal = await this.masterGetSubTotal(2022, category_object.id);

                return sub_total;
            })
        );

        const set_sub_totals: Set<MasterSubTotal> = new Set(sub_totals);

        master_inventory_data.kategori.forEach(async (category_object, category_index) => {
            const sub_total: MasterSubTotal = Array.from(set_sub_totals).find((sub_total) => sub_total.category_id === category_object.id);
            let item_count: number = 0;

            table_data.push({
                actions: {
                    category_id: category_object.id,
                    item_id: "",
                    isKategori: true,
                    isWhiteSpace: false,
                },
                id: await romanizeNumber(category_index + 1),
                kategori: category_object.kategori,
                nama: category_object.kategori,
                satuan: "",
                saldo_jumlah_satuan: "",
                mutasi_barang_masuk_jumlah_satuan: "",
                mutasi_barang_keluar_jumlah_satuan: "",
                saldo_akhir_jumlah_satuan: "",
                harga_satuan: "",
                keterangan: "",
                saldo_jumlah_satuan_rp: "",
                mutasi_barang_masuk_jumlah_satuan_rp: "",
                mutasi_barang_keluar_jumlah_satuan_rp: "",
                saldo_akhir_jumlah_satuan_rp: "",
                isKategori: true,
                isWhiteSpace: false,
            });

            category_object.barang.forEach((item_object, item_index) => {
                table_data.push({
                    actions: {
                        category_id: category_object.id,
                        item_id: item_object.id,
                        isKategori: false,
                        isWhiteSpace: false,
                    },
                    id: item_index + 1,
                    kategori: category_object.kategori,
                    nama: item_object.nama,
                    satuan: item_object.satuan,
                    saldo_jumlah_satuan: item_object.saldo_jumlah_satuan,
                    mutasi_barang_masuk_jumlah_satuan: item_object.mutasi_barang_masuk_jumlah_satuan,
                    mutasi_barang_keluar_jumlah_satuan: item_object.mutasi_barang_keluar_jumlah_satuan,
                    saldo_akhir_jumlah_satuan: item_object.saldo_akhir_jumlah_satuan,
                    jumlah_permintaan: item_object.jumlah_permintaan,
                    harga_satuan: item_object.harga_satuan,
                    keterangan: item_object.keterangan,
                    saldo_jumlah_satuan_rp: item_object.saldo_jumlah_satuan * item_object.harga_satuan,
                    mutasi_barang_masuk_jumlah_satuan_rp: item_object.mutasi_barang_masuk_jumlah_satuan * item_object.harga_satuan,
                    mutasi_barang_keluar_jumlah_satuan_rp: item_object.mutasi_barang_keluar_jumlah_satuan * item_object.harga_satuan,
                    saldo_akhir_jumlah_satuan_rp: item_object.saldo_akhir_jumlah_satuan * item_object.harga_satuan,
                    isKategori: false,
                });

                item_count += 1;
            });

            if (item_count > 0) {
                table_data.push({
                    actions: {
                        category_id: "",
                        item_id: "",
                        isKategori: false,
                        isWhiteSpace: true,
                    },
                    id: "",
                    kategori: "",
                    nama: "",
                    satuan: "",
                    saldo_jumlah_satuan: "",
                    mutasi_barang_masuk_jumlah_satuan: "",
                    mutasi_barang_keluar_jumlah_satuan: "",
                    saldo_akhir_jumlah_satuan: "",
                    harga_satuan: "",
                    keterangan: "",
                    saldo_jumlah_satuan_rp: "",
                    mutasi_barang_masuk_jumlah_satuan_rp: "",
                    mutasi_barang_keluar_jumlah_satuan_rp: "",
                    saldo_akhir_jumlah_satuan_rp: "",
                    isKategori: true,
                    isWhiteSpace: false,
                });
            }

            table_data.push({
                actions: {
                    category_id: category_object.id,
                    item_id: "",
                    isKategori: false,
                    isWhiteSpace: true,
                },
                id: "",
                kategori: category_object.kategori,
                nama: `SUB TOTAL ${category_object.kategori}`,
                satuan: "",
                saldo_jumlah_satuan: "",
                mutasi_barang_masuk_jumlah_satuan: "",
                mutasi_barang_keluar_jumlah_satuan: "",
                saldo_akhir_jumlah_satuan: "",
                harga_satuan: "",
                keterangan: "",
                saldo_jumlah_satuan_rp: sub_total.saldo,
                mutasi_barang_masuk_jumlah_satuan_rp: sub_total.mutasi_barang_masuk,
                mutasi_barang_keluar_jumlah_satuan_rp: sub_total.mutasi_barang_keluar,
                saldo_akhir_jumlah_satuan_rp: sub_total.saldo_akhir,
                isKategori: true,
                isWhiteSpace: false,
            });
            table_data.push({
                actions: {
                    category_id: "",
                    item_id: "",
                    isKategori: false,
                    isWhiteSpace: true,
                },
                id: "",
                kategori: "",
                nama: "",
                satuan: "",
                saldo_jumlah_satuan: "",
                mutasi_barang_masuk_jumlah_satuan: "",
                mutasi_barang_keluar_jumlah_satuan: "",
                saldo_akhir_jumlah_satuan: "",
                harga_satuan: "",
                keterangan: "",
                saldo_jumlah_satuan_rp: "",
                mutasi_barang_masuk_jumlah_satuan_rp: "",
                mutasi_barang_keluar_jumlah_satuan_rp: "",
                saldo_akhir_jumlah_satuan_rp: "",
                isKategori: true,
                isWhiteSpace: true,
            });
        });

        return table_data;
    }
}
