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
 * @fileoverview The request inventory controller.
 * @author Rizky Irswanda <rizky.irswanda115@gmail.com>
 */

import { currentDate, slugifyDate } from "@/shared/utils/util";
import { RequestBarangWithCategoryNameAndItemName, RequestCreateBarang } from "@/shared/typings/types/inventory";
import { Body, Controller, Get, Logger, Param, ParseIntPipe, Post, Put, Response, StreamableFile, UseInterceptors } from "@nestjs/common";
import { pythonAxiosInstance } from "@/shared/utils/axiosInstance";
import { createReadStream } from "fs";
import dayjs from "dayjs";
import { join } from "path";
import { MasterInventoryService } from "../master/master-inventory.service";
import { RequestInventoryService } from "./request-inventory.service";
import { RequestBarang } from "./schema/request-inventory.schema";
import { ResponseFormat, ResponseFormatInterceptor } from "@/server/common/interceptors/response-format.interceptor";
import { DownloadOptionData, DownloadOptionDataDate, ResponseObject } from "@/shared/typings/interfaces/inventory.interface";
import { readdirSync } from "fs";

/**
 * @class RequestInventoryDataController
 * @description The request inventory controller.
 */
@Controller("__api/data/inventory/request")
export class RequestInventoryController {
    private readonly logger = new Logger(RequestInventoryController.name);

    /**
     * @constructor
     * @description Creates a new request inventory controller.
     * @param {RequestInventoryService} requestInventoryService - The request inventory service.
     */
    constructor(private readonly requestInventoryService: RequestInventoryService, private readonly masterInventoryService: MasterInventoryService) {}

    /**
     * @description Get every request barang object
     * @returns {Promise<RequestBarang[]>} The request barang object
     */
    @Get("barang/all")
    @UseInterceptors(ResponseFormatInterceptor)
    public async requestGetBarangAll(): Promise<ResponseFormat<ResponseObject<RequestBarangWithCategoryNameAndItemName[]>>> {
        return await this.requestInventoryService.requestGetBarangAll(2022);
    }

    /**
     * @description Get request barang object based on id
     * @param {Number} id - The id
     * @returns {Promise<RequestBarang>} The request barang object
     */
    @Get("barang/:id")
    @UseInterceptors(ResponseFormatInterceptor)
    public async requestGetBarangById(
        @Param("id", new ParseIntPipe()) id: number
    ): Promise<ResponseFormat<ResponseObject<RequestBarangWithCategoryNameAndItemName>>> {
        return await this.requestInventoryService.requestGetBarangById(2022, id);
    }

    /**
     * @description Get request barang object based on status
     * @param {Number} status - The status
     * @returns {Promise<RequestBarang[]>} The request barang object
     */
    @Get("barang/status/:status")
    @UseInterceptors(ResponseFormatInterceptor)
    public async requestGetBarangByStatus(
        @Param("status", new ParseIntPipe()) status: number
    ): Promise<ResponseFormat<ResponseObject<RequestBarangWithCategoryNameAndItemName[]>>> {
        return await this.requestInventoryService.requestGetBarangByStatus(2022, status);
    }

    /**
     * @description Create a new request barang object
     * @param {ParameterRequestCreateItemDto} body - The new barang data
     * @returns {Promise<RequestBarang>} The new request barang object
     */
    @Post("new/barang")
    @UseInterceptors(ResponseFormatInterceptor)
    public async requestCreateBarang(@Body() body: RequestCreateBarang): Promise<ResponseFormat<ResponseObject<RequestBarang>>> {
        return await this.requestInventoryService.requestCreateBarang(2022, body);
    }

    /**
     * @description Response an barang object based on id and status
     * @param {Number} id - The barang id
     * @param {Number} status - The status
     * @returns {Promise<RequestBarang>} Return the responded barang object
     */
    @Put("response/barang/:id/status/:status")
    @UseInterceptors(ResponseFormatInterceptor)
    public async requestResponseBarangById(
        @Param("id", new ParseIntPipe()) id: number,
        @Param("status", new ParseIntPipe()) status: number
    ): Promise<ResponseFormat<ResponseObject<RequestBarang>>> {
        return await this.requestInventoryService.requestResponseBarangById(2022, id, status);
    }

    /* -------------------------------- DOWNLOAD -------------------------------- */

    @Get("download/option")
    public masterDownloadOption() {
        const files: string[] = readdirSync("./spreadsheets/inventories/request");

        const file: number = files.indexOf(".gitkeep");
        if (file !== -1) {
            files.splice(file, 1);
        }

        const file_option_array: [string, string[]][] = [];
        files.forEach((file: string) => {
            const file_name_array: string[] = file.split(".")[0].split(" ");
            if (file_name_array.length > 1) {
                const file_date: string[] = file_name_array[file_name_array.length - 1].split("-");
                const formatted_file_date: string = `${file_date[0]}-${file_date[1]}-${file_date[2]} ${file_date[3]}:${file_date[4]}:${file_date[5]}`;

                if (dayjs(formatted_file_date).isValid()) {
                    const file_name: string = file_name_array.slice(0, -1).join(" ");

                    let file_name_is_valid: boolean = true;
                    file_option_array.forEach((file_item: [string, string[]]) => {
                        if (file_item[0] == file_name) {
                            file_name_is_valid = false;
                        }
                    });

                    if (file_name_is_valid) {
                        file_option_array.push([file_name, [formatted_file_date]]);
                    } else if (!file_name_is_valid) {
                        file_option_array.forEach((file_item) => {
                            if (file_item[0] == file_name) {
                                file_item[1].push(formatted_file_date);
                            }
                        });
                    }
                }
            }
        });

        const file_option_data: DownloadOptionData[] = [];
        file_option_array.forEach((file_item: [string, string[]], index: number) => {
            const file_date_data: DownloadOptionDataDate[] = [];
            file_item[1].forEach((file_date: string, index: number) => {
                const new_file_date_object: DownloadOptionDataDate = {
                    id: index + 1,
                    date: file_date,
                };

                file_date_data.push(new_file_date_object);
            });

            const new_file_option_object: DownloadOptionData = {
                id: index + 1,
                name: file_item[0],
                date: file_date_data,
            };

            (file_option_data as DownloadOptionData[]).push(new_file_option_object);
        });

        return file_option_data;
    }

    @Get("download/raw/latest")
    public async masterRawDownloadLatest(@Response({ passthrough: true }) res: any): Promise<StreamableFile> {
        const current_date = slugifyDate(currentDate());
        const response = await pythonAxiosInstance.post(`__api/inventory/request/download/raw/${current_date}`);

        if (response.data.success) {
            const file = createReadStream(join(process.cwd(), `spreadsheets/inventories/request/raw ${current_date}.xlsx`));
            res.set({
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="Laporan Mentah Permintaan Barang ${current_date}.xlsx"`,
            });
            return new StreamableFile(file);
        }
    }

    @Get("download/name/:name/date/:date")
    public async masterDownloadByNameAndDate(
        @Param("name") name: string,
        @Param("date") date: string,
        @Response({ passthrough: true }) res: any
    ): Promise<StreamableFile> {
        const file = createReadStream(join(process.cwd(), `spreadsheets/inventories/request/${name} ${date}.xlsx`));
        res.set({
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="Laporan Mentah Permintaan Barang ${date}.xlsx"`,
        });
        return new StreamableFile(file);
    }
}
