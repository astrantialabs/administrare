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
 * @fileoverview The Data controller.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { from, Observable, toArray } from "rxjs";

import { InventoryDataPayload } from "@/shared/typings/interfaces/inventory-payload.interface";

import { UtilsService } from "../../../utils/utils.service";
import { MasterInventoryService as MasterInventoryService } from "./master-inventory.service";
import { MasterBarang, MasterInventory, MasterInventoryDataDocument } from "./schema/master-inventory.schema";
import { ParameterCreateItemDto } from "./dto/item.schema";
import { FormikCreateKategoriModel, ParameterCreateCategoryDto } from "./dto/category.schema";

/**
 * @class MasterInventoryDataController
 * @description The master inventory data controller.
 */
@Controller("__api/data/inventory")
export class MasterInventoryController {
    private readonly logger = new Logger(MasterInventoryController.name);

    /**
     * @constructor
     * @description Creates a new master inventory data controller.
     * @param {MasterInventoryService} masterInventoryService - The master inventory service.
     * @param {UtilsService} utilsService  - The utils service.
     */
    constructor(
        private readonly masterInventoryService: MasterInventoryService,
        private readonly utilsService: UtilsService
    ) {}

    //#region main

    /**
     * @description Find all data.
     * @returns {Promise<MasterInventoryDataDocument[]>} The data.
     */
    @Get("")
    public async findAll(): Promise<MasterInventoryDataDocument[]> {
        return this.masterInventoryService.findAll();
    }

    @Get("/actions/update/:kategori_id/:barang_id")
    public async update(
        @Param("kategori_id") kategori_id: number,
        @Param("barang_id") barang_id: number
    ): Promise<any> {
        const original_data = await this.masterInventoryService.findAll();

        let payload: any[] = [];

        original_data.forEach(async (inventoryItem: MasterInventoryDataDocument) => {
            inventoryItem.inventory.forEach(async (item: MasterInventory) => {
                if (item.id == kategori_id) {
                    item.barang.forEach(async (barang: MasterBarang) => {
                        if (barang.id == barang_id) {
                            payload.push({
                                uraian_barang: barang.nama,
                                satuan: barang.satuan,
                                saldo_jumlah_satuan: barang.saldo.jumlah_satuan,
                                saldo_harga_satuan: barang.saldo.harga_satuan,
                                mutasi_barang_masuk_jumlah_satuan: barang.mutasi_barang_masuk.jumlah_satuan,
                                mutasi_barang_masuk_harga_satuan: barang.mutasi_barang_masuk.harga_satuan,
                                mutasi_barang_keluar_jumlah_satuan: barang.mutasi_barang_keluar.jumlah_satuan,
                                mutasi_barang_keluar_harga_satuan: barang.mutasi_barang_keluar.harga_satuan,
                                saldo_akhir_jumlah_satuan: barang.saldo_akhir.jumlah_satuan,
                                saldo_akhir_harga_satuan: barang.saldo_akhir.harga_satuan,
                            });
                        }
                    });
                }
            });
        });

        return from(payload).pipe(toArray());
    }

    /**
     * @description Finds all data and format it for table display.
     * @return {Promise<Observable<InventoryDataPayload[]>>} The data.
     */
    @Get("table")
    public async findAllAndFormatToTable(): Promise<Observable<InventoryDataPayload[]>> {
        try {
            const data = await this.masterInventoryService.findAll();
            let table_data: InventoryDataPayload[] = [];

            data.forEach((data_item) => {
                data_item.inventory.forEach(async (inventory_item, inventory_index) => {
                    table_data.push({
                        actions: {
                            category_id: inventory_item.id,
                            item_id: null,
                            isKategori: true,
                        },
                        no: await this.utilsService.romanizeNumber(inventory_index + 1),
                        uraian_barang: inventory_item.kategori,
                        satuan: "",
                        saldo_jumlah_satuan: "",
                        saldo_harga_satuan: "",
                        saldo_jumlah: "",
                        mutasi_barang_masuk_jumlah_satuan: "",
                        mutasi_barang_masuk_harga_satuan: "",
                        mutasi_barang_masuk_jumlah: "",
                        mutasi_barang_keluar_jumlah_satuan: "",
                        mutasi_barang_keluar_harga_satuan: "",
                        mutasi_barang_keluar_jumlah: "",
                        saldo_akhir_jumlah_satuan: "",
                        saldo_akhir_harga_satuan: "",
                        saldo_akhir_jumlah: "",
                        isCategory: true,
                    });

                    if (inventory_item.barang.length === 0) return;

                    inventory_item.barang.forEach((barang_item, barang_index) => {
                        table_data.push({
                            actions: {
                                category_id: inventory_item.id,
                                item_id: barang_item.id,
                                isKategori: false,
                            },
                            no: barang_index + 1,
                            uraian_barang: barang_item.nama,
                            satuan: barang_item.satuan,
                            saldo_jumlah_satuan: this.utilsService.isNull(barang_item.saldo.jumlah_satuan),
                            saldo_harga_satuan: this.utilsService.isNull(barang_item.saldo.harga_satuan),
                            saldo_jumlah: this.utilsService
                                .isNull(barang_item.saldo.jumlah_satuan * barang_item.saldo.harga_satuan)
                                .toString(),
                            mutasi_barang_masuk_jumlah_satuan: this.utilsService.isNull(
                                barang_item.mutasi_barang_masuk.jumlah_satuan
                            ),
                            mutasi_barang_masuk_harga_satuan: this.utilsService.isNull(
                                barang_item.mutasi_barang_masuk.harga_satuan
                            ),
                            mutasi_barang_masuk_jumlah: this.utilsService.multiply(
                                barang_item.mutasi_barang_masuk.jumlah_satuan,
                                barang_item.mutasi_barang_masuk.harga_satuan
                            ),
                            mutasi_barang_keluar_jumlah_satuan: this.utilsService.isNull(
                                barang_item.mutasi_barang_keluar.jumlah_satuan
                            ),
                            mutasi_barang_keluar_harga_satuan: this.utilsService.isNull(
                                barang_item.mutasi_barang_keluar.harga_satuan
                            ),
                            mutasi_barang_keluar_jumlah: this.utilsService.multiply(
                                barang_item.mutasi_barang_keluar.jumlah_satuan,
                                barang_item.mutasi_barang_keluar.harga_satuan
                            ),
                            saldo_akhir_jumlah_satuan: this.utilsService.isNull(barang_item.saldo_akhir.jumlah_satuan),
                            saldo_akhir_harga_satuan: this.utilsService.isNull(barang_item.saldo_akhir.harga_satuan),
                            saldo_akhir_jumlah: this.utilsService.multiply(
                                barang_item.saldo_akhir.jumlah_satuan,
                                barang_item.saldo_akhir.harga_satuan
                            ),
                            isCategory: false,
                        });
                    });
                });
            });

            return from(table_data).pipe(toArray());
        } catch (error) {
            this.logger.error(error);
        }
    }

    //#endregion main

    //#region utilities

    /**
     * @description Finds all data categories
     * @returns {Promise<string[]>} The data categories.
     */
    @Get("categories")
    public async findAllCategories(): Promise<Observable<string[]>> {
        const data = await this.masterInventoryService.findAll();
        let categories: any[] = [];

        data.forEach(async (inventoryItem: MasterInventoryDataDocument) => {
            inventoryItem.inventory.forEach(async (item: MasterInventory) => {
                categories.push({
                    kategori: item.kategori,
                    id: item.id,
                });
            });
        });

        return from(categories).pipe(toArray());
    }

    @Get("categories/roman")
    public async findAllCategoriesRomanNumeral(): Promise<Observable<string[]>> {
        const data = await this.masterInventoryService.findAll();
        let categories_roman: string[] = [];

        data.forEach(async (inventoryItem: MasterInventoryDataDocument) => {
            inventoryItem.inventory.forEach(async (item: MasterInventory, index) => {
                categories_roman.push(await this.utilsService.romanizeNumber(index + 1));
            });
        });

        return from(categories_roman).pipe(toArray());
    }

    /**
     * @description Create a new category then add based on year
     * @param {ParCreateCategoryDto} body - The data required
     * @returns {ResCreateCategoryDto} The new category data
     */
    @Post("test")
    public async test(@Body() body: any): Promise<any> {
        try {
            this.logger.debug(body);
            return;
        } catch (error) {
            this.logger.error(error);
        }
    }

    //#endregion utilities

    //#region master

    /**
     * @description Get category data based on year and category id
     * @param {Number} category_id - The category id
     * @returns {MasterInventory} The category data
     */
    @Get("master/get/kategori/:category_id")
    public async masterGetKategoriByKategoriId(
        @Param("category_id", new ParseIntPipe()) category_id: number
    ): Promise<MasterInventory> {
        return await this.masterInventoryService.masterGetKategoriByKategoriId(2022, category_id);
    }

    /**
     * @description Get item data based on year, category id and item id
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @returns {MasterBarang} The item data
     */
    @Get("master/get/kategori/:category_id/barang/:item_id")
    public async masterGetBarangByKategoriIdAndBarangId(
        @Param("category_id", new ParseIntPipe()) category_id: number,
        @Param("item_id", new ParseIntPipe()) item_id: number
    ): Promise<MasterBarang> {
        return await this.masterInventoryService.masterGetBarangByKategoriIdAndBarangId(2022, category_id, item_id);
    }

    /**
     * @description Create a new category then add based on year
     * @param {ParameterCreateCategoryDto} body - The data required
     * @returns {MasterInventory} The new category data
     */
    @Post("master/create/kategori")
    public async masterCreateKategori(@Body() body: FormikCreateKategoriModel): Promise<MasterInventory> {
        try {
            const payload: ParameterCreateCategoryDto = {
                tahun: 2022,
                kategori: body.kategori.toUpperCase(),
            };
            return await this.masterInventoryService.masterCreateKategori(payload.tahun, payload.kategori);
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * @description Create a new item then add based on year and category id
     * @param {ParameterCreateItemDto} body - The data required
     * @returns {MasterBarang} The new item data
     */
    @Post("master/create/barang")
    public async masterCreateBarang(@Body() body: any): Promise<MasterBarang> {
        try {
            const payload: ParameterCreateItemDto = {
                tahun: body.tahun,
                kategori_id: body.kategori_id,
                nama: body.nama,
                satuan: body.satuan,
                saldo: {
                    jumlah_satuan: parseInt(body.saldo_jumlah_satuan),
                    harga_satuan: parseInt(body.saldo_harga_satuan),
                },
                mutasi_barang_masuk: {
                    jumlah_satuan: parseInt(body.mutasi_barang_masuk_jumlah_satuan),
                    harga_satuan: parseInt(body.mutasi_barang_masuk_harga_satuan),
                },
                mutasi_barang_keluar: {
                    jumlah_satuan: parseInt(body.mutasi_barang_keluar_jumlah_satuan),
                    harga_satuan: parseInt(body.mutasi_barang_keluar_harga_satuan),
                },
                saldo_akhir: {
                    jumlah_satuan: parseInt(body.saldo_akhir_jumlah_satuan),
                    harga_satuan: parseInt(body.saldo_akhir_harga_satuan),
                },
            };

            const barang: MasterBarang = {
                id: await this.masterInventoryService.getNewItemId(payload.tahun, payload.kategori_id),
                nama: payload.nama,
                satuan: payload.satuan,
                saldo: payload.saldo,
                mutasi_barang_masuk: payload.mutasi_barang_masuk,
                mutasi_barang_keluar: payload.mutasi_barang_keluar,
                saldo_akhir: payload.saldo_akhir,
            };

            return await this.masterInventoryService.masterCreateBarang(payload.tahun, payload.kategori_id, barang);
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * @description Update category data based on year and category id
     * @param {Number} category_id - The category id
     * @param {String} kategori - The new category name
     * @returns {MasterInventory} The updated category data
     */
    @Put("master/update/kategori/:category_id")
    public async masterUpdateKategoriByKategoriId(
        @Param("category_id", new ParseIntPipe()) category_id: number,
        @Body("kategori") kategori: string
    ): Promise<MasterInventory> {
        return await this.masterInventoryService.masterUpdateKategoriByKategoriId(2022, category_id, kategori);
    }

    /**
     * @description update item data based on year, category id and item id
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @param {Any} body - the new item data
     * @returns {MasterBarang} The updated item data
     */
    @Put("master/update/kategori/:category_id/barang/:item_id")
    public async masterUpdateBarangByKategoriIdAndBarangId(
        @Param("category_id", new ParseIntPipe()) category_id: number,
        @Param("item_id", new ParseIntPipe()) item_id: number,
        @Body() body: any
    ): Promise<MasterBarang> {
        let barang: MasterBarang = {
            id: item_id,
            nama: body.nama,
            satuan: body.satuan,
            saldo: {
                jumlah_satuan: parseInt(body.saldo_jumlah_satuan),
                harga_satuan: parseInt(body.saldo_harga_satuan),
            },
            mutasi_barang_masuk: {
                jumlah_satuan: parseInt(body.mutasi_barang_masuk_jumlah_satuan),
                harga_satuan: parseInt(body.mutasi_barang_masuk_harga_satuan),
            },
            mutasi_barang_keluar: {
                jumlah_satuan: parseInt(body.mutasi_barang_keluar_jumlah_satuan),
                harga_satuan: parseInt(body.mutasi_barang_keluar_harga_satuan),
            },
            saldo_akhir: {
                jumlah_satuan: parseInt(body.saldo_akhir_jumlah_satuan),
                harga_satuan: parseInt(body.saldo_akhir_harga_satuan),
            },
        };

        return await this.masterInventoryService.masterUpdateBarangByKategoriIdAndBarangId(
            2022,
            category_id,
            item_id,
            barang
        );
    }

    /**
     * @description Delete category data based on year and category id
     * @param {Number} category_id - The category id
     * @returns {MasterInventory} The deleted category data
     */
    @Delete("master/delete/kategori/:category_id")
    public async masterDeleteKategoriByKategoriId(
        @Param("category_id", new ParseIntPipe()) category_id: number
    ): Promise<MasterInventory> {
        try {
            return await this.masterInventoryService.masterDeleteKategoriByKategoriId(2022, category_id);
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * @description Delete item data based on year, category id and item id
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @returns {MasterBarang} The deleted item data
     */
    @Delete("master/delete/kategori/:category_id/item/:item_id")
    public async masterDeleteBarangByKategoriIdAndBarangId(
        @Param("category_id", new ParseIntPipe()) category_id: number,
        @Param("item_id", new ParseIntPipe()) item_id: number
    ): Promise<MasterBarang> {
        try {
            return await this.masterInventoryService.masterDeleteBarangByKategoriIdAndBarangId(
                2022,
                category_id,
                item_id
            );
        } catch (error) {
            this.logger.error(error);
        }
    }

    //#endregion master
}
