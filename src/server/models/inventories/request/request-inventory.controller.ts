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

import { JumlahData } from "@/shared/typings/types/inventory";
import { currentDate } from "@/shared/utils/util";
import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, ParseIntPipe, Post, Put, Response, StreamableFile } from "@nestjs/common";
import { pythonAxiosInstance } from "@/shared/utils/axiosInstance";
import { createReadStream } from "fs";
import { join } from "path";
import { MasterInventoryService } from "../master/master-inventory.service";
import { ParameterRequestCreateItemDto } from "./dto/item.schema";
import { RequestInventoryService } from "./request-inventory.service";
import { RequestBarang } from "./schema/request-inventory.schema";

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
    public async requestGetBarangAll(): Promise<any> {
        return await this.requestInventoryService.requestGetBarangAll(2022);
    }

    /**
     * @description Get request barang object based on id
     * @param {Number} id - The id
     * @returns {Promise<RequestBarang>} The request barang object
     */
    @Get("barang/:id")
    public async requestGetBarangById(@Param("id", new ParseIntPipe()) id: number): Promise<any> {
        return await this.requestInventoryService.requestGetBarangById(2022, id);
    }

    /**
     * @description Get request barang object based on status
     * @param {Number} status - The status
     * @returns {Promise<RequestBarang[]>} The request barang object
     */
    @Get("barang/status/:status")
    public async requestGetBarangByStatus(@Param("status", new ParseIntPipe()) status: number): Promise<any> {
        return await this.requestInventoryService.requestGetBarangByStatus(2022, status);
    }

    /**
     * @description Create a new request barang object
     * @param {ParameterRequestCreateItemDto} body - The new barang data
     * @returns {Promise<RequestBarang>} The new request barang object
     */
    @Post("new/barang")
    public async requestCreateBarang(@Body() body: ParameterRequestCreateItemDto): Promise<RequestBarang | HttpException> {
        if (body.total > 0) {
            let jumlah_data: JumlahData = await this.masterInventoryService.masterGetSaldoAkhirAndPermintaanByKategoriIdAndBarangId(
                2022,
                body.kategori_id,
                body.barang_id
            );

            if (jumlah_data.saldo_akhir >= jumlah_data.permintaan + body.total) {
                let item: RequestBarang = {
                    id: (await this.requestGetBarangAll()).length + 1,
                    kategori_id: body.kategori_id,
                    barang_id: body.barang_id,
                    username: body.username,
                    total: body.total,
                    deskripsi: body.deskripsi,
                    created_at: currentDate(),
                    responded_at: null,
                    status: 0,
                };

                this.masterInventoryService.masterIncreaseJumlahPermintaanByKategoriIdAndBarangId(2022, item.kategori_id, item.barang_id, item.total);

                return await this.requestInventoryService.requestCreateBarang(2022, item);
            } else if (jumlah_data.saldo_akhir < jumlah_data.permintaan + body.total) {
                return new HttpException("saldo_akhir not enough", HttpStatus.BAD_GATEWAY);
            }
        } else if (body.total <= 0) {
            return new HttpException("total needs to be more than 0", HttpStatus.BAD_GATEWAY);
        }
    }

    /**
     * @description Response an barang object based on id and status
     * @param {Number} id - The barang id
     * @param {Number} status - The status
     * @returns {Promise<RequestBarang>} Return the responded barang object
     */
    @Put("response/barang/:id/status/:status")
    public async requestResponseBarangById(
        @Param("id", new ParseIntPipe()) id: number,
        @Param("status", new ParseIntPipe()) status: number
    ): Promise<RequestBarang | HttpException> {
        return await this.requestInventoryService.requestResponseBarangById(2022, id, status);
    }

    /* -------------------------------- DOWNLOAD -------------------------------- */

    @Get("download/latest")
    public async masterDownloadLatest(@Response({ passthrough: true }) res: any): Promise<StreamableFile> {
        const current_date = currentDate();
        const response = await pythonAxiosInstance.post(`__api/inventory/request/download/${current_date}`);

        if (response.data.success) {
            const file = createReadStream(join(process.cwd(), `spreadsheets/inventories/request/${current_date}.xlsx`));
            res.set({
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename="Laporan Permintaan Barang.xlsx"`,
            });
            return new StreamableFile(file);
        }
    }
}
