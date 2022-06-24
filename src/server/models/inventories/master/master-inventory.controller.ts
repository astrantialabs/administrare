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
 * @fileoverview The master inventory controller.
 * @author Rizky Irswanda <rizky.irswanda115@gmail.com>
 */

import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Post, Put, Response, StreamableFile, UseInterceptors } from "@nestjs/common";
import { MasterInventoryService } from "./master-inventory.service";
import { MasterBarang, MasterInventoryDataDocument, MasterKategori } from "./schema/master-inventory.schema";
import {
    ItemSearchData,
    MasterParameterBarang,
    MasterParameterDependency,
    MasterParameterKategori,
    MasterSubTotal,
    MasterTotal,
} from "@/shared/typings/types/inventory";
import { CategoriesPayload } from "@/shared/typings/interfaces/categories-payload.interface";
import { pythonAxiosInstance } from "@/shared/utils/axiosInstance";
import { createReadStream } from "fs";
import { join } from "path";
import { currentDate, readJSON, slugifyDate } from "@/shared/utils/util";
import { ResponseFormat, ResponseFormatInterceptor } from "@/server/common/interceptors/response-format.interceptor";
import { ResponseObject } from "@/shared/typings/interfaces/inventory.interface";

/**
 * @class MasterInventoryDataController
 * @description The master inventory controller.
 */
@Controller("__api/data/inventory/master")
export class MasterInventoryController {
    private readonly logger = new Logger(MasterInventoryController.name);

    /**
     * @constructor
     * @description Creates a new master inventory controller.
     * @param {MasterInventoryService} masterInventoryService - The master inventory service.
     */
    constructor(private readonly masterInventoryService: MasterInventoryService) {}

    /* ---------------------------------- MAIN ---------------------------------- */

    /**
     * @description Find an inventory document based on year
     * @returns {Promise<MasterInventoryDataDocument>} The inventory document
     */
    @Get()
    public async masterFindOne(): Promise<MasterInventoryDataDocument> {
        return this.masterInventoryService.masterFindOne(2022);
    }

    /* --------------------------------- UTILITY -------------------------------- */

    /**
     * @description Search all items
     * @returns {Promise<ItemSearchData[]>} Return all items
     */
    @Get("search/barang/all")
    public async masterSearchBarangAll(): Promise<ItemSearchData[]> {
        return await this.masterInventoryService.masterSearchBarangAll(2022);
    }

    /**
     * @description Search items based on name
     * @param {String} name - The name
     * @returns {Promise<ItemSearchData[]>} Return filtered items
     */
    @Get("search/barang/:name")
    public async masterSearchBarangByName(@Param("name") name: string): Promise<ItemSearchData[]> {
        return await this.masterInventoryService.masterSearchBarangByName(2022, name);
    }

    @Get("subtotal/kategori/:category_id")
    public async masterGetSubTotal(@Param("category_id", new ParseIntPipe()) category_id: number): Promise<MasterSubTotal> {
        return await this.masterInventoryService.masterGetSubTotal(2022, category_id);
    }

    @Get("total")
    public async masterGetTotal(): Promise<MasterTotal> {
        return await this.masterInventoryService.masterGetTotal(2022);
    }

    /* ---------------------------------- CRUD ---------------------------------- */

    /**
     * @description Get all kategori object
     * @returns {Promise<MasterKategori[]>} Return all kategori object
     */
    @Get("kategori/all")
    @UseInterceptors(ResponseFormatInterceptor)
    public async masterGetKategoriAll(): Promise<ResponseFormat<ResponseObject<MasterKategori[]>>> {
        return await this.masterInventoryService.masterGetKategoriAll(2022);
    }

    /**
     * @description Get all barang object based on category id
     * @param {Number} category_id - The category id
     * @returns {Promise<MasterBarang[]>} Return all barang object
     */
    @Get("kategori/:category_id/barang/all")
    @UseInterceptors(ResponseFormatInterceptor)
    public async masterGetBarangAllByKategoriId(
        @Param("category_id", new ParseIntPipe()) category_id: number
    ): Promise<ResponseFormat<ResponseObject<MasterBarang[]>>> {
        return await this.masterInventoryService.masterGetBarangAllByKategoriId(2022, category_id);
    }

    /**
     * @description Get kategori object based on category id
     * @param {Number} category_id - The category id
     * @returns {Promise<MasterKategori>} Return kategori object
     */
    @Get("kategori/:category_id")
    @UseInterceptors(ResponseFormatInterceptor)
    public async masterGetKategoriByKategoriId(
        @Param("category_id", new ParseIntPipe()) category_id: number
    ): Promise<ResponseFormat<ResponseObject<MasterKategori>>> {
        return await this.masterInventoryService.masterGetKategoriByKategoriId(2022, category_id);
    }

    /**
     * @description Get barang object based on category id and item id
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @returns {Promise<MasterBarang>} Return barang object
     */
    @Get("kategori/:category_id/barang/:item_id")
    @UseInterceptors(ResponseFormatInterceptor)
    public async masterGetBarangByKategoriIdAndBarangId(
        @Param("category_id", new ParseIntPipe()) category_id: number,
        @Param("item_id", new ParseIntPipe()) item_id: number
    ): Promise<ResponseFormat<ResponseObject<MasterBarang>>> {
        return await this.masterInventoryService.masterGetBarangByKategoriIdAndBarangId(2022, category_id, item_id);
    }

    /**
     * @description Get the name of category object based on category id
     * @param {Number} category_id - The category id
     * @returns {Promise<string>} Return the name of category object
     */
    @Get("kategori/:category_id/name")
    @UseInterceptors(ResponseFormatInterceptor)
    public async masterGetKategoriNameByKategoriId(
        @Param("category_id", new ParseIntPipe()) category_id: number
    ): Promise<ResponseFormat<ResponseObject<string>>> {
        return await this.masterInventoryService.masterGetKategoriNameByKategoriId(2022, category_id);
    }

    /**
     * @description Get the name of item object based on category id and item id
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @returns {Promise<string>} Return the name of item object
     */
    @Get("kategori/:category_id/barang/:item_id/name")
    @UseInterceptors(ResponseFormatInterceptor)
    public async masterGetBarangNameByKategoriIdAndBarangId(
        @Param("category_id", new ParseIntPipe()) category_id: number,
        @Param("item_id", new ParseIntPipe()) item_id: number
    ): Promise<ResponseFormat<ResponseObject<string>>> {
        return await this.masterInventoryService.masterGetBarangNameByKategoriIdAndBarangId(2022, category_id, item_id);
    }

    /**
     * @description Create a new kategori object
     * @param {String} kategori - The new kategori
     * @returns {Promise<MasterKategori>} Return the new kategori object
     */
    @Post("new/kategori")
    @UseInterceptors(ResponseFormatInterceptor)
    public async masterCreateKategori(@Body() body: MasterParameterKategori): Promise<ResponseFormat<ResponseObject<MasterKategori>>> {
        return await this.masterInventoryService.masterCreateKategori(2022, body);
    }

    /**
     * @description Create a new barang object
     * @param {ParameterMasterCreateItemDto} body - The new barang data
     * @returns {Promise<MasterBarang>} Return the new barang object
     */
    @Post("new/barang")
    @UseInterceptors(ResponseFormatInterceptor)
    public async masterCreateBarang(@Body() body: MasterParameterBarang): Promise<ResponseFormat<ResponseObject<MasterBarang>>> {
        return await this.masterInventoryService.masterCreateBarang(2022, body);
    }

    /**
     * @description Update kategori object based on category id
     * @param {Number} category_id - The category id
     * @param {String} kategori - The kategori
     * @returns {Promise<MasterKategori>} Return the updated kategori object
     */
    @Put("kategori/:category_id")
    @UseInterceptors(ResponseFormatInterceptor)
    public async masterUpdateKategoriByKategoriId(
        @Param("category_id", new ParseIntPipe()) category_id: number,
        @Body() body: MasterParameterKategori
    ): Promise<ResponseFormat<ResponseObject<MasterKategori>>> {
        return await this.masterInventoryService.masterUpdateKategoriByKategoriId(2022, category_id, body);
    }

    /**
     * @description Update barang object based on category id and item item id
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @param {ParameterMasterUpdateItemDto} body - The barang data
     * @returns {Promise<MasterBarang>} Return the updated barang object
     */
    @Put("kategori/:category_id/barang/:item_id")
    @UseInterceptors(ResponseFormatInterceptor)
    public async masterUpdateBarangByKategoriIdAndItemId(
        @Param("category_id", new ParseIntPipe()) category_id: number,
        @Param("item_id", new ParseIntPipe()) item_id: number,
        @Body() body: MasterParameterBarang
    ): Promise<ResponseFormat<ResponseObject<MasterBarang>>> {
        return await this.masterInventoryService.masterUpdateBarangByKategoriIdAndItemId(2022, category_id, item_id, body);
    }

    /**
     * @description Delete kategori object based on category id
     * @param {Number} category_id - The category id
     * @returns {Promise<MasterKategori>} Return the deleted kategori object
     */
    @Delete("kategori/:category_id")
    @UseInterceptors(ResponseFormatInterceptor)
    public async masterDeleteKategoriByKategoriId(
        @Param("category_id", new ParseIntPipe()) category_id: number
    ): Promise<ResponseFormat<ResponseObject<MasterKategori>>> {
        return await this.masterInventoryService.masterDeleteKategoriByKategoriId(2022, category_id);
    }

    /**
     * @description Delete barang object based on category id and item id
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @returns {Promise<MasterBarang>} Return the deleted barang object
     */
    @Delete("kategori/:category_id/barang/:item_id")
    @UseInterceptors(ResponseFormatInterceptor)
    public async masterDeleteBarangByKategoriIdAndBarangId(
        @Param("category_id", new ParseIntPipe()) category_id: number,
        @Param("item_id", new ParseIntPipe()) item_id: number
    ): Promise<ResponseFormat<ResponseObject<MasterBarang>>> {
        return await this.masterInventoryService.masterDeleteBarangByKategoriIdAndBarangId(2022, category_id, item_id);
    }

    /* ---------------------------------- TABLE --------------------------------- */

    /**
     * @description Get all kategori object name, id and roman numeral.
     * @returns {Promise<MasterKategori[]>} The kategori object name, id and roman numeral.
     */
    @Get("table/kategori/all")
    public async masterTableGetKategoriAll(): Promise<CategoriesPayload> {
        return await this.masterInventoryService.masterTableGetKategoriAll(2022);
    }

    /**
     * @description Get all formatted table data
     */
    @Get("table/all")
    public async masterTableGetAll(): Promise<any> {
        return await this.masterInventoryService.masterTableGetAll();
    }

    /* -------------------------------- DOWNLOAD -------------------------------- */

    @Post("update/dependency")
    public async masterUpdateDependency(@Body() body: MasterParameterDependency) {
        const response = await pythonAxiosInstance.post("__api/inventory/master/update/dependency", body);

        return response.data;
    }

    @Get("download/latest")
    public async masterDownloadLatest(@Response({ passthrough: true }) res: any): Promise<StreamableFile> {
        const current_date = slugifyDate(currentDate());
        const response = await pythonAxiosInstance.post(`__api/inventory/master/download/${current_date}`);

        if (response.data.success) {
            const file = createReadStream(join(process.cwd(), `spreadsheets/inventories/master/${current_date}.xlsx`));
            const dependency_data = readJSON("./scripts/json/dependency_data.json");
            res.set({
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="LAPORAN INVENTARISASI PERSEDIAAN SEMESTERAN ${dependency_data.tahun_akhir}.xlsx"`,
            });
            return new StreamableFile(file);
        }
    }
}
