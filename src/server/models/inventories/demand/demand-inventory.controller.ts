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

import { Body, Controller, Get, Logger, Param, ParseIntPipe, Post, Put, Response, StreamableFile, UseInterceptors } from "@nestjs/common";
import { pythonAxiosInstance } from "@/shared/utils/axiosInstance";
import { currentDate, readJSON, slugifyDate } from "@/shared/utils/util";
import { createReadStream } from "fs";
import { join } from "path";
import { DemandInventoryService } from "./demand-inventory.service";
import { DemandBarang, DemandKategori } from "./schema/demand-inventory.schema";
import { ResponseFormat, ResponseFormatInterceptor } from "@/server/common/interceptors/response-format.interceptor";
import { DemandBarangWithCategoryName, DemandCreateBarang, DemandCreateKategori } from "@/shared/typings/types/inventory";
import { ResponseObject } from "@/shared/typings/interfaces/inventory.interface";

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
    @UseInterceptors(ResponseFormatInterceptor)
    public async demandGetKategoriAll(): Promise<ResponseFormat<ResponseObject<DemandKategori[]>>> {
        return await this.demandInventoryService.demandGetKategoriAll(2022);
    }

    /**
     * @description Get every item demand object
     * @returns {Promise<DemandBarang[]>} The item demand object
     */
    @Get("barang/all")
    @UseInterceptors(ResponseFormatInterceptor)
    public async demandGetBarangAll(): Promise<ResponseFormat<ResponseObject<DemandBarangWithCategoryName[]>>> {
        return await this.demandInventoryService.demandGetBarangAll(2022);
    }

    /**
     * @description Get category demand object based on id
     * @param {Number} id - The category demand id
     * @returns {Promise<DemandKategori>} The category demand object
     */
    @Get("kategori/:id")
    @UseInterceptors(ResponseFormatInterceptor)
    public async demandGetKategoriById(@Param("id", new ParseIntPipe()) id: number): Promise<ResponseFormat<ResponseObject<DemandKategori>>> {
        return await this.demandInventoryService.demandGetKategoriById(2022, id);
    }

    /**
     * @description Get item demand object based on id
     * @param {Number} id - The item demand id
     * @returns {Promise<DemandBarang>} The item demand object
     */
    @Get("barang/:id")
    @UseInterceptors(ResponseFormatInterceptor)
    public async demandGetBarangById(@Param("id", new ParseIntPipe()) id: number): Promise<ResponseFormat<ResponseObject<DemandBarangWithCategoryName>>> {
        return await this.demandInventoryService.demandGetBarangById(2022, id);
    }

    /**
     * @description Filter category demand object based on status
     * @param {Number} status - The status
     * @returns {Promise<DemandKategori[]>} The filtered category demand object
     */
    @Get("kategori/status/:status")
    @UseInterceptors(ResponseFormatInterceptor)
    public async demandGetKategoriByStatus(@Param("status", new ParseIntPipe()) status: number): Promise<ResponseFormat<ResponseObject<DemandKategori[]>>> {
        return await this.demandInventoryService.demandGetKategoriByStatus(2022, status);
    }

    /**
     * @description Filter item demand object based on status
     * @param {Number} status - The status
     * @returns {Promise<DemandBarang[]>} The filtered item demand object
     */
    @Get("barang/status/:status")
    @UseInterceptors(ResponseFormatInterceptor)
    public async demandGetBarangByStatus(@Param("status", new ParseIntPipe()) status: number): Promise<ResponseFormat<ResponseObject<DemandBarang[]>>> {
        return await this.demandInventoryService.demandGetBarangByStatus(2022, status);
    }

    /**
     * @description Create a new category demand object
     * @param {string} username - The user who demands the new category object
     * @param {String} category - The new demanded category name
     * @returns {Promise<DemandKategori>} The new demanded category object
     */
    @Post("new/kategori")
    @UseInterceptors(ResponseFormatInterceptor)
    public async demandCreateKategori(@Body() body: DemandCreateKategori): Promise<ResponseFormat<ResponseObject<DemandKategori>>> {
        return await this.demandInventoryService.demandCreateKategori(2022, body);
    }

    /**
     * @description Create a new item demand object
     * @param {Number} category_id - The category id
     * @param {String} username - The user who demands the new item object
     * @param {String} barang - The new demanded item name
     * @returns {DemandBarang} The new demanded item object
     */
    @Post("new/barang")
    @UseInterceptors(ResponseFormatInterceptor)
    public async demandCreateBarang(@Body() body: DemandCreateBarang): Promise<ResponseFormat<ResponseObject<DemandBarang>>> {
        return await this.demandInventoryService.demandCreateBarang(2022, body);
    }

    /**
     * @description Update status of category demand object
     * @param {Number} id - The category demand id
     * @param {Number} status - The new status
     * @returns {Promise<DemandKategori>} The updated status of category demand object
     */
    @Put("response/kategori/:id/status/:status")
    @UseInterceptors(ResponseFormatInterceptor)
    public async demandResponseKategoriById(
        @Param("id", new ParseIntPipe()) id: number,
        @Param("status", new ParseIntPipe()) status: number
    ): Promise<ResponseFormat<ResponseObject<DemandKategori>>> {
        return await this.demandInventoryService.demandResponseKategoriById(2022, id, status);
    }

    /**
     * @description Update status of item demand object
     * @param {Number} id - The item demand id
     * @param {Number} status - The new status
     * @returns {DemandBarang} The updated status of item demand object
     */
    @Put("response/barang/:id/status/:status")
    @UseInterceptors(ResponseFormatInterceptor)
    public async demandResponseBarangById(
        @Param("id", new ParseIntPipe()) id: number,
        @Param("status", new ParseIntPipe()) status: number
    ): Promise<ResponseFormat<ResponseObject<DemandBarang>>> {
        return await this.demandInventoryService.demandResponseBarangById(2022, id, status);
    }

    /* -------------------------------- DOWNLOAD -------------------------------- */

    @Get("download/option")
    public async demandDownloadOption() {
        const response = await pythonAxiosInstance.post("/__api/inventory/demand/update/option");

        if (response.data.success) {
            return readJSON("./scripts/json/demand_option_data.json");
        }
    }

    @Get("download/user/:user_id/date/:date_id")
    public async demandDownloadByUserIdAndDateId(
        @Param("user_id") user_id: number,
        @Param("date_id") date_id: number,
        @Response({ passthrough: true }) res: any
    ): Promise<StreamableFile> {
        const option_data = readJSON("./scripts/json/demand_option_data.json");

        let username_value: string;
        let date_value: string;
        let is_creatable: boolean;
        option_data.forEach((user_object: any) => {
            if (user_object.id == user_id) {
                username_value = user_object.name;

                user_object.date.forEach((date_object: any) => {
                    if (date_object.id == date_id) {
                        date_value = date_object.date;
                        is_creatable = date_object.creatable;
                    }
                });
            }
        });

        const slugified_date = slugifyDate(date_value);

        if (username_value == "Mentah") {
            if (date_value == "Terbaru" && is_creatable == true) {
                const current_date = slugifyDate(currentDate());
                const response = await pythonAxiosInstance.post(`/__api/inventory/demand/download/raw/${current_date}`);

                if (response.data.success) {
                    const file = createReadStream(join(process.cwd(), `spreadsheets/inventories/demand/${username_value} ${current_date}.xlsx`));
                    res.set({
                        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "Content-Disposition": `attachment; filename="Laporan ${username_value} Permintaan Kategori dan Barang Baru ${current_date}.xlsx"`,
                    });

                    return new StreamableFile(file);
                }
            } else if (date_value != "Terbaru" && is_creatable == false) {
                const file = createReadStream(join(process.cwd(), `spreadsheets/inventories/demand/${username_value} ${slugified_date}.xlsx`));
                res.set({
                    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "Content-Disposition": `attachment; filename="Laporan ${username_value} Permintaan Kategori dan Barang Baru ${slugified_date}.xlsx"`,
                });

                return new StreamableFile(file);
            }
        }
    }
}
