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

import { UtilsService } from "../../utils/utils.service";
import { InventoryService } from "./inventory.service";
import { Barang, Inventory, InventoryDataDocument } from "./schema/inventory.schema";
import { ParameterCreateItemDto } from "./dto/item/create-item.schema";
import { FormikCreateKategoriModel, ParameterCreateCategoryDto } from "./dto/category/create-category.schema";
import { DemandBarang, DemandKategori } from "./schema/demand-inventory";

/**
 * @class DataController
 * @description The Data controller.
 */
@Controller("api/data/inventory")
export class InventoryController {
    private readonly logger = new Logger(InventoryController.name);

    /**
     * @constructor
     * @description Creates a new data controller.
     * @param {InventoryService} inventoryService - The data service.
     * @param {UtilsService} utilsService  - The utils service.
     */
    constructor(private readonly inventoryService: InventoryService, private readonly utilsService: UtilsService) {}

    //#region main

    /**
     * @description Find all data.
     * @returns {Promise<InventoryDataDocument[]>} The data.
     */
    @Get("")
    public async findAll(): Promise<InventoryDataDocument[]> {
        return this.inventoryService.findAll();
    }

    @Get("/actions/update/:kategori_id/:barang_id")
    public async update(
        @Param("kategori_id") kategori_id: number,
        @Param("barang_id") barang_id: number
    ): Promise<any> {
        const original_data = await this.inventoryService.findAll();

        let payload: any[] = [];

        original_data.forEach(async (inventoryItem: InventoryDataDocument) => {
            inventoryItem.inventory.forEach(async (item: Inventory) => {
                if (item.id == kategori_id) {
                    item.barang.forEach(async (barang: Barang) => {
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
            const data = await this.inventoryService.findAll();
            let table_data: InventoryDataPayload[] = [];

            data.forEach((data_item) => {
                data_item.inventory.forEach(async (inventory_item, inventory_index) => {
                    table_data.push({
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
        const data = await this.inventoryService.findAll();
        let categories: any[] = [];

        data.forEach(async (inventoryItem: InventoryDataDocument) => {
            inventoryItem.inventory.forEach(async (item: Inventory) => {
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
        const data = await this.inventoryService.findAll();
        let categories_roman: string[] = [];

        data.forEach(async (inventoryItem: InventoryDataDocument) => {
            inventoryItem.inventory.forEach(async (item: Inventory, index) => {
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

    //#region crud

    /**
     * @description Get category data based on year and category id
     * @param {Number} category_id - The category id
     * @returns {Inventory} The category data
     */
    @Get("get/:category_id")
    public async getKategori(@Param("category_id", new ParseIntPipe()) category_id: number): Promise<Inventory> {
        return await this.inventoryService.getKategori(2022, category_id);
    }

    /**
     * @description Get item data based on year, category id and item id
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @returns {Barang} The item data
     */
    @Get("get/:category_id/:item_id")
    public async getItem(
        @Param("category_id", new ParseIntPipe()) category_id: number,
        @Param("item_id", new ParseIntPipe()) item_id: number
    ): Promise<Barang> {
        return await this.inventoryService.getItem(2022, category_id, item_id);
    }

    /**
     * @description Create a new category then add based on year
     * @param {ParameterCreateCategoryDto} body - The data required
     * @returns {Inventory} The new category data
     */
    @Post("create/kategori")
    public async createKategori(@Body() body: FormikCreateKategoriModel): Promise<Inventory> {
        try {
            const payload: ParameterCreateCategoryDto = {
                tahun: 2022,
                kategori: body.kategori.toUpperCase(),
            };
            return await this.inventoryService.createKategori(payload.tahun, payload.kategori);
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * @description Create a new item then add based on year and category id
     * @param {ParameterCreateItemDto} body - The data required
     * @returns {Barang} The new item data
     */
    @Post("create/barang")
    public async createBarang(@Body() body: any): Promise<Barang> {
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

            const barang: Barang = {
                id: await this.inventoryService.getNewItemId(payload.tahun, payload.kategori_id),
                nama: payload.nama,
                satuan: payload.satuan,
                saldo: payload.saldo,
                mutasi_barang_masuk: payload.mutasi_barang_masuk,
                mutasi_barang_keluar: payload.mutasi_barang_keluar,
                saldo_akhir: payload.saldo_akhir,
            };

            return await this.inventoryService.createBarang(payload.tahun, payload.kategori_id, barang);
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * @description Update category data based on year and category id
     * @param {Number} category_id - The category id
     * @param {String} kategori - The new category name
     * @returns {Inventory} The updated category data
     */
    @Put("update/:category_id")
    public async updateKategori(
        @Param("category_id", new ParseIntPipe()) category_id: number,
        @Body("kategori") kategori: string
    ): Promise<Inventory> {
        return await this.inventoryService.updateKategori(2022, category_id, kategori);
    }

    /**
     * @description update item data based on year, category id and item id
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @param {Any} body - the new item data
     * @returns {Barang} The updated item data
     */
    @Put("update/:category_id/:item_id")
    public async updateItem(
        @Param("category_id", new ParseIntPipe()) category_id: number,
        @Param("item_id", new ParseIntPipe()) item_id: number,
        @Body() body: any
    ): Promise<Barang> {
        let barang: Barang = {
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

        return await this.inventoryService.updateItem(2022, category_id, item_id, barang);
    }

    /**
     * @description Delete category data based on year and category id
     * @param {Number} category_id - The category id
     * @returns {Inventory} The deleted category data
     */
    @Delete("delete/:category_id")
    public async deleteKategori(@Param("category_id", new ParseIntPipe()) category_id: number): Promise<Inventory> {
        try {
            return await this.inventoryService.deleteKategori(2022, category_id);
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * @description Delete item data based on year, category id and item id
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @returns {Barang} The deleted item data
     */
    @Delete("delete/:category_id/:item_id")
    public async deleteBarang(
        @Param("category_id", new ParseIntPipe()) category_id: number,
        @Param("item_id", new ParseIntPipe()) item_id: number
    ): Promise<Barang> {
        try {
            return await this.inventoryService.deleteBarang(2022, category_id, item_id);
        } catch (error) {
            this.logger.error(error);
        }
    }

    //#endregion crud

    //#region demand

    /**
     * @description Get every category demand data based on year
     * @returns {DemandKategori[]} The category demand data
     */
    @Get("demand/kategori/all")
    public async demandKategoriAll(): Promise<DemandKategori[]> {
        return await this.inventoryService.demandKategoriAll(2022);
    }

    /**
     * @description Filter category demand data based on status
     * @param {Number} status - The status
     * @returns {DemandKategori[]} The filtered category demand data
     */
    @Get("demand/kategori/:status")
    public async demandKategoriByStatus(
        @Param("status", new ParseIntPipe()) status: number
    ): Promise<DemandKategori[]> {
        return await this.inventoryService.demandKategoriByStatus(2022, status);
    }

    /**
     * @description Create a new category demand
     * @param {string} username - The user who demands the new category
     * @param {String} category - The new demanded category name
     * @returns {DemandKategori} The new demanded category data
     */
    @Post("demand/create/kategori")
    public async demandCreateKategori(
        @Body("username") username: string,
        @Body("kategori") category: string
    ): Promise<DemandKategori> {
        try {
            return await this.inventoryService.demandCreateKategori(2022, username, category);
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * @description Get every item demand data based on year
     * @returns {DemandBarang[]} The item demand data
     */
    @Get("demand/barang/all")
    public async demandBarangAll(): Promise<DemandBarang[]> {
        return await this.inventoryService.demandBarangAll(2022);
    }

    /**
     * @description Filter item demand data based on status
     * @param {Number} status - The status
     * @returns {DemandBarang[]} The filtered item demand data
     */
    @Get("demand/barang/:status")
    public async demandBarangByStatus(@Param("status", new ParseIntPipe()) status: number): Promise<DemandBarang[]> {
        return await this.inventoryService.demandBarangByStatus(2022, status);
    }

    /**
     * @description Create a new item demand
     * @param {Number} category_id - The category id
     * @param {String} username - The user who demands the new item
     * @param {String} barang - The new demanded item name
     * @returns {DemandBarang} The new demanded item data
     */
    @Post("demand/create/barang")
    public async demandCreateBarang(
        @Body("kategori_id", new ParseIntPipe()) category_id: number,
        @Body("username") username: string,
        @Body("barang") barang: string
    ): Promise<DemandBarang> {
        try {
            return await this.inventoryService.demandCreateBarang(2022, category_id, username, barang);
        } catch (error) {
            this.logger.error(error);
        }
    }

    //#endregion demand
}
