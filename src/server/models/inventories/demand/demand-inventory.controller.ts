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
 * @fileoverview The demand inventory controller.
 * @author Rizky Irswanda <rizky.irswanda115@gmail.com>
 */

import { Body, Controller, Get, HttpException, Logger, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { DemandInventoryService } from "./demand-inventory.service";
import { DemandBarang, DemandKategori } from "./schema/demand-inventory";

/**
 * @class DemandInventoryController
 * @description The demand inventory data controller.
 */
@Controller("__api/data/inventory/demand")
export class DemandInventoryController {
    private readonly logger = new Logger(DemandInventoryController.name);

    /**
     * @constructor
     * @description Creates a new demand inventory data controller.
     * @param {DemandInventoryService} demandInventoryService - The demand inventory service.
     */
    constructor(private readonly demandInventoryService: DemandInventoryService) {}

    /**
     * @description Get every category demand data based on year
     * @returns {DemandKategori[]} The category demand data
     */
    @Get("get/kategori/all")
    public async demandGetKategoriAll(): Promise<DemandKategori[]> {
        return await this.demandInventoryService.demandGetKategoriAll(2022);
    }

    /**
     * @description Get every item demand data based on year
     * @returns {DemandBarang[]} The item demand data
     */
    @Get("get/barang/all")
    public async demandGetBarangAll(): Promise<DemandBarang[]> {
        return await this.demandInventoryService.demandGetBarangAll(2022);
    }

    /**
     * @description Get category demand data based on year and id
     * @param {Number} id - The category demand id
     * @returns {DemandKategori} The category demand data
     */
    @Get("get/kategori/:id")
    public async demandGetKategoriById(@Param("id", new ParseIntPipe()) id: number): Promise<DemandKategori> {
        return await this.demandInventoryService.demandGetKategoriById(2022, id);
    }

    /**
     * @description Get item demand data based on year and id
     * @param {Number} id - The item demand id
     * @returns {DemandBarang} The item demand data
     */
    @Get("get/barang/:id")
    public async demandGetBarangById(@Param("id", new ParseIntPipe()) id: number): Promise<DemandBarang> {
        return await this.demandInventoryService.demandGetBarangById(2022, id);
    }

    /**
     * @description Filter category demand data based on status
     * @param {Number} status - The status
     * @returns {DemandKategori[]} The filtered category demand data
     */
    @Get("get/kategori/status/:status")
    public async demandGetKategoriByStatus(
        @Param("status", new ParseIntPipe()) status: number
    ): Promise<DemandKategori[]> {
        return await this.demandInventoryService.demandGetKategoriByStatus(2022, status);
    }

    /**
     * @description Filter item demand data based on status
     * @param {Number} status - The status
     * @returns {DemandBarang[]} The filtered item demand data
     */
    @Get("get/barang/status/:status")
    public async demandGetBarangByStatus(@Param("status", new ParseIntPipe()) status: number): Promise<DemandBarang[]> {
        return await this.demandInventoryService.demandGetBarangByStatus(2022, status);
    }

    /**
     * @description Create a new category demand
     * @param {string} username - The user who demands the new category
     * @param {String} category - The new demanded category name
     * @returns {DemandKategori} The new demanded category data
     */
    @Post("create/kategori")
    public async demandCreateKategori(
        @Body("username") username: string,
        @Body("kategori") category: string
    ): Promise<DemandKategori> {
        try {
            return await this.demandInventoryService.demandCreateKategori(2022, username, category);
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * @description Create a new item demand
     * @param {Number} category_id - The category id
     * @param {String} username - The user who demands the new item
     * @param {String} barang - The new demanded item name
     * @returns {DemandBarang} The new demanded item data
     */
    @Post("create/barang")
    public async demandCreateBarang(
        @Body("kategori_id", new ParseIntPipe()) category_id: number,
        @Body("username") username: string,
        @Body("barang") barang: string,
        @Body("satuan") satuan: string
    ): Promise<DemandBarang> {
        try {
            return await this.demandInventoryService.demandCreateBarang(2022, category_id, username, barang, satuan);
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * @description Update status of category demand data
     * @param {Number} id - The category demand id
     * @param {Number} status - The new status
     * @returns {DemandKategori} The updated status of category demand data
     */
    @Put("response/kategori/:id/status/:status")
    public async demandResponseKategoriById(
        @Param("id", new ParseIntPipe()) id: number,
        @Param("status", new ParseIntPipe()) status: number
    ): Promise<DemandKategori | HttpException> {
        try {
            return await this.demandInventoryService.demandResponseKategoriById(2022, id, status);
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * @description Update status of item demand data
     * @param {Number} id - The item demand id
     * @param {Number} status - The new status
     * @returns {DemandBarang} The updated status of item demand data
     */
    @Put("response/barang/:id/status/:status")
    public async demandResponseBarangById(
        @Param("id", new ParseIntPipe()) id: number,
        @Param("status", new ParseIntPipe()) status: number
    ): Promise<DemandBarang | HttpException> {
        try {
            return await this.demandInventoryService.demandResponseBarangById(2022, id, status);
        } catch (error) {
            this.logger.error(error);
        }
    }
}
