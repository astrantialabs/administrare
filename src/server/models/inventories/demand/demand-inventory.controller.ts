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
 * @fileoverview The demand inventory controller.
 * @author Rizky Irswanda <rizky.irswanda115@gmail.com>
 */

import { Body, Controller, Get, HttpException, Logger, Param, ParseIntPipe, Post, Put, Response, StreamableFile } from "@nestjs/common";
import { pythonAxiosInstance } from "@/shared/utils/axiosInstance";
import { currentDate } from "@/shared/utils/util";
import { createReadStream } from "fs";
import { join } from "path";
import { DemandInventoryService } from "./demand-inventory.service";
import { DemandBarang, DemandKategori } from "./schema/demand-inventory.schema";

/**
 * @class DemandInventoryController
 * @description The demand inventory controller.
 */
@Controller("__api/data/inventory/demand")
export class DemandInventoryController {
    private readonly logger = new Logger(DemandInventoryController.name);

    /**
     * @constructor
     * @description Creates a new demand inventory controller.
     * @param {DemandInventoryService} demandInventoryService - The demand inventory service.
     */
    constructor(private readonly demandInventoryService: DemandInventoryService) {}

    /**
     * @description Get every category demand object
     * @returns {Promise<DemandKategori[]>} The category demand object
     */
    @Get("kategori/all")
    public async demandGetKategoriAll(): Promise<DemandKategori[]> {
        return await this.demandInventoryService.demandGetKategoriAll(2022);
    }

    /**
     * @description Get every item demand object
     * @returns {Promise<DemandBarang[]>} The item demand object
     */
    @Get("barang/all")
    public async demandGetBarangAll(): Promise<any> {
        return await this.demandInventoryService.demandGetBarangAll(2022);
    }

    /**
     * @description Get category demand object based on id
     * @param {Number} id - The category demand id
     * @returns {Promise<DemandKategori>} The category demand object
     */
    @Get("kategori/:id")
    public async demandGetKategoriById(@Param("id", new ParseIntPipe()) id: number): Promise<DemandKategori> {
        return await this.demandInventoryService.demandGetKategoriById(2022, id);
    }

    /**
     * @description Get item demand object based on id
     * @param {Number} id - The item demand id
     * @returns {Promise<DemandBarang>} The item demand object
     */
    @Get("barang/:id")
    public async demandGetBarangById(@Param("id", new ParseIntPipe()) id: number): Promise<any> {
        return await this.demandInventoryService.demandGetBarangById(2022, id);
    }

    /**
     * @description Filter category demand object based on status
     * @param {Number} status - The status
     * @returns {Promise<DemandKategori[]>} The filtered category demand object
     */
    @Get("kategori/status/:status")
    public async demandGetKategoriByStatus(@Param("status", new ParseIntPipe()) status: number): Promise<DemandKategori[]> {
        return await this.demandInventoryService.demandGetKategoriByStatus(2022, status);
    }

    /**
     * @description Filter item demand object based on status
     * @param {Number} status - The status
     * @returns {Promise<DemandBarang[]>} The filtered item demand object
     */
    @Get("barang/status/:status")
    public async demandGetBarangByStatus(@Param("status", new ParseIntPipe()) status: number): Promise<any> {
        return await this.demandInventoryService.demandGetBarangByStatus(2022, status);
    }

    /**
     * @description Create a new category demand object
     * @param {string} username - The user who demands the new category object
     * @param {String} category - The new demanded category name
     * @returns {Promise<DemandKategori>} The new demanded category object
     */
    @Post("new/kategori")
    public async demandCreateKategori(@Body("username") username: string, @Body("kategori") category: string): Promise<DemandKategori> {
        try {
            return await this.demandInventoryService.demandCreateKategori(2022, username, category);
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * @description Create a new item demand object
     * @param {Number} category_id - The category id
     * @param {String} username - The user who demands the new item object
     * @param {String} barang - The new demanded item name
     * @returns {DemandBarang} The new demanded item object
     */
    @Post("new/barang")
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
     * @description Update status of category demand object
     * @param {Number} id - The category demand id
     * @param {Number} status - The new status
     * @returns {Promise<DemandKategori>} The updated status of category demand object
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
     * @description Update status of item demand object
     * @param {Number} id - The item demand id
     * @param {Number} status - The new status
     * @returns {DemandBarang} The updated status of item demand object
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

    /* -------------------------------- DOWNLOAD -------------------------------- */

    @Get("download/latest")
    public async masterDownloadLatest(@Response({ passthrough: true }) res: any): Promise<StreamableFile> {
        const current_date = currentDate();
        const response = await pythonAxiosInstance.post(`__api/inventory/demand/download/${current_date}`);

        if (response.data.success) {
            const file = createReadStream(join(process.cwd(), `spreadsheets/inventories/demand/${current_date}.xlsx`));
            res.set({
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="Laporan Permintaan Kategori dan Barang Baru.xlsx"`,
            });
            return new StreamableFile(file);
        }
    }
}
