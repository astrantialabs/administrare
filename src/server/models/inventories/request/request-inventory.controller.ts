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

import { currentDate, readJSON, slugifyDate } from "@/shared/utils/util";
import { RequestBarangExtended, RequestCreateBarang } from "@/shared/typings/types/inventory";
import { Body, Controller, Get, Logger, Param, ParseIntPipe, Post, Put, StreamableFile, UseInterceptors, Response } from "@nestjs/common";
import { MasterInventoryService } from "../master/master-inventory.service";
import { RequestInventoryService } from "./request-inventory.service";
import { RequestBarang } from "./schema/request-inventory.schema";
import { ResponseFormat, ResponseFormatInterceptor } from "@/server/common/interceptors/response-format.interceptor";
import { ResponseObject } from "@/shared/typings/interfaces/inventory.interface";
import { pythonAxiosInstance } from "@/shared/utils/axiosInstance";
import { createReadStream } from "fs";
import { join } from "path";

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
    public async requestGetBarangAll(): Promise<ResponseFormat<ResponseObject<RequestBarangExtended[]>>> {
        return await this.requestInventoryService.requestGetBarangAll(2022);
    }

    /**
     * @description Get request barang object based on id
     * @param {Number} id - The id
     * @returns {Promise<RequestBarang>} The request barang object
     */
    @Get("barang/:id")
    @UseInterceptors(ResponseFormatInterceptor)
    public async requestGetBarangById(@Param("id", new ParseIntPipe()) id: number): Promise<ResponseFormat<ResponseObject<RequestBarangExtended>>> {
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
    ): Promise<ResponseFormat<ResponseObject<RequestBarangExtended[]>>> {
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
    public async masterDownloadOption() {
        const response = await pythonAxiosInstance.post("/__api/inventory/request/update/option");

        if (response.data.success) {
            return readJSON("./scripts/json/request_option_data.json");
        }
    }

    @Get("download/user/:user_id/date/:date_id")
    public async masterDownloadByUserIdAndDateId(
        @Param("user_id") user_id: number,
        @Param("date_id") date_id: number,
        @Response({ passthrough: true }) res: any
    ): Promise<StreamableFile> {
        const option_data = readJSON("./scripts/json/request_option_data.json");

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
                const response = await pythonAxiosInstance.post(`/__api/inventory/request/download/raw/${current_date}`);

                if (response.data.success) {
                    const file = createReadStream(join(process.cwd(), `spreadsheets/inventories/request/${username_value} ${current_date}.xlsx`));
                    res.set({
                        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "Content-Disposition": `attachment; filename="Laporan ${username_value} Permintaan Barang ${current_date}.xlsx"`,
                    });

                    return new StreamableFile(file);
                }
            } else if (date_value != "Terbaru" && is_creatable == false) {
                const file = createReadStream(join(process.cwd(), `spreadsheets/inventories/request/${username_value} ${slugified_date}.xlsx`));
                res.set({
                    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "Content-Disposition": `attachment; filename="Laporan ${username_value} Permintaan Barang ${slugified_date}.xlsx"`,
                });

                return new StreamableFile(file);
            }
        } else if (username_value != "Mentah") {
            if (is_creatable) {
                const response = await pythonAxiosInstance.post(`/__api/inventory/request/download/user/${user_id}/date/${date_id}`);

                if (response.data.success) {
                    const file = createReadStream(join(process.cwd(), `spreadsheets/inventories/request/${username_value} ${slugified_date}.docx`));
                    res.set({
                        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "Content-Disposition": `attachment; filename="Laporan ${username_value} Permintaan Barang ${slugified_date}.docx"`,
                    });

                    return new StreamableFile(file);
                }
            } else if (!is_creatable) {
                const file = createReadStream(join(process.cwd(), `spreadsheets/inventories/request/${username_value} ${slugified_date}.docx`));
                res.set({
                    "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "Content-Disposition": `attachment; filename="Laporan ${username_value} Permintaan Barang ${slugified_date}.docx"`,
                });

                return new StreamableFile(file);
            }
        }
    }
}
