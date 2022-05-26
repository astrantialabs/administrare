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

import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Post } from "@nestjs/common";
import { from, Observable, toArray } from "rxjs";

import { InventoryDataPayload } from "@/shared/typings/interfaces/inventory-payload.interface";

import { UtilsService } from "../../utils/utils.service";
import { InventoryService } from "./inventory.service";
import { Inventory, InventoryDataDocument } from "./schema/inventory.schema";
import { FormikCreateBarangModel, ParameterCreateItemDto, ResponseCreateItemDto } from "./dto/item/create-item.schema";
import {
    FormikCreateKategoriModel,
    ParameterCreateCategoryDto,
    ResponseCreateCategoryDto,
} from "./dto/category/create-category.schema";
import { ParameterDeleteCategoryDto, ResponseDeleteCategoryDto } from "./dto/category/delete-category.schema";
import { ParameterDeleteItemDto, ResponseDeleteItemDto } from "./dto/item/delete.item.schema";
import { ParameterDemandCategoryDto, ResponseDemandCategoryDto } from "./dto/category/demand-category.schema";
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

    /**
     * @description Find all data.
     * @returns {Promise<InventoryDataDocument[]>} The data.
     */
    @Get("")
    public async findAll(): Promise<InventoryDataDocument[]> {
        return this.inventoryService.findAll();
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

    // @todo:When at form, add option to select which year to add data to

    /**
     * @description Create a new category then add based on year
     * @param {ParameterCreateCategoryDto} body - The data required
     * @returns {ResponseCreateCategoryDto} The new category data
     */
    @Post("create/kategori")
    public async createKategori(@Body() body: FormikCreateKategoriModel): Promise<ResponseCreateCategoryDto> {
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

    // @todo:When at form, add option to select which year to add data to

    /**
     * @description Create a new item then add based on year and category id
     * @param {ParameterCreateItemDto} body - The data required
     * @returns {ResponseCreateItemDto} The new item data
     */
    @Post("create/barang")
    public async createBarang(@Body() body: any): Promise<ResponseCreateItemDto> {
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

            const barang: ResponseCreateItemDto = {
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
     * @description Delete category data based on year and category id
     * @param {ParameterDeleteCategoryDto} body - The data required
     * @returns {ResponseDeleteCategoryDto} The deleted category data
     */
    @Delete("delete/kategori")
    public async deleteKategori(@Body() body: ParameterDeleteCategoryDto): Promise<ResponseDeleteCategoryDto> {
        try {
            return await this.inventoryService.deleteKategori(body.tahun, body.kategori_id);
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * @description Delete item data based on year, category id and item id
     * @param {ParameterDeleteItemDto} body - The data required
     * @returns {ResponseDeleteItemDto} The deleted item data
     */
    @Delete("delete/barang")
    public async deleteBarang(@Body() body: ParameterDeleteItemDto): Promise<ResponseDeleteItemDto> {
        try {
            return await this.inventoryService.deleteBarang(body.tahun, body.kategori_id, body.barang_id);
        } catch (error) {
            this.logger.error(error);
        }
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
     * @description Create a new category demand then add based on year
     * @param {ParameterDemandCategoryDto} body - The data required
     * @returns {ResponseDemandCategoryDto} The new demanded category data
     */
    @Post("demand/create/kategori")
    public async demandCreateKategori(@Body() body: ParameterDemandCategoryDto): Promise<ResponseDemandCategoryDto> {
        try {
            return await this.inventoryService.demandCreateKategori(body.tahun, body.kategori);
        } catch (error) {
            this.logger.error(error);
        }
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
}
