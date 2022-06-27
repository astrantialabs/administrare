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

import { RequestBarangExtended, RequestCreateBarang } from "@/shared/typings/types/inventory";
import { Body, Controller, Get, Logger, Param, ParseIntPipe, Post, Put, StreamableFile, UseInterceptors, Response } from "@nestjs/common";
import { RequestInventoryService } from "./request-inventory.service";
import { RequestBarang } from "./schema/request-inventory.schema";
import { ResponseFormat, ResponseFormatInterceptor } from "@/server/common/interceptors/response-format.interceptor";
import { ResponseObject } from "@/shared/typings/interfaces/inventory.interface";

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
    constructor(private readonly requestInventoryService: RequestInventoryService) {}

    /* ---------------------------------- CRUD ---------------------------------- */

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
    public async requestDownloadOption() {
        return await this.requestInventoryService.requestDownloadOption();
    }

    @Get("download/user/:user_id/date/:date_id")
    public async requestDownloadByUserIdAndDateId(
        @Param("user_id") user_id: number,
        @Param("date_id") date_id: number,
        @Response({ passthrough: true }) res: any
    ): Promise<StreamableFile> {
        return await this.requestInventoryService.requestDownloadByUserIdAndDateId(user_id, date_id, res);
    }
}
