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
 * @fileoverview The master inventory controller.
 * @author Rizky Irswanda <rizky.irswanda115@gmail.com>
 */

import { Body, Controller, Delete, Get, Logger, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { UtilsService } from "../../../utils/utils.service";
import { MasterTestInventoryService } from "./master-test-inventory.service";
import {
    MasterTestBarang,
    MasterTestInventoryDataDocument,
    MasterTestKategori,
} from "./schema/master-test-inventory.schema";
import { ParameterMasterTestCreateItemDto, ParameterMasterTestUpdateItemDto } from "./dto/item.schema";
import { ItemSearchData } from "@/shared/typings/types/inventory";

/**
 * @class MasterInventoryDataController
 * @description The master inventory controller.
 */
@Controller("__api/data/inventory/master-test")
export class MasterTestInventoryController {
    private readonly logger = new Logger(MasterTestInventoryController.name);

    /**
     * @constructor
     * @description Creates a new master inventory controller.
     * @param {MasterInventoryService} masterInventoryService - The master inventory service.
     * @param {UtilsService} utilsService  - The utils service.
     */
    constructor(
        private readonly masterTestInventoryService: MasterTestInventoryService,
        private readonly utilsService: UtilsService
    ) {}

    //#region main

    /**
     * @description Find an inventory document based on year
     * @returns {Promise<MasterInventoryDataDocument>} The inventory document
     */
    @Get()
    public async masterFindOne(): Promise<MasterTestInventoryDataDocument> {
        return this.masterTestInventoryService.masterFindOne(2022);
    }

    //#endregion main

    //#region utility

    /**
     * @description Search items based on name
     * @param {String} name - The name
     * @returns {Promise<ItemSearchData[]>} Return filtered items
     */
    @Get("search/barang/:name")
    public async masterSearchBarangByName(@Param("name") name: string): Promise<ItemSearchData[]> {
        return await this.masterTestInventoryService.masterSearchBarangByName(2022, name);
    }

    //#endregion utility

    //#region crud

    /**
     * @description Get all kategori object
     * @returns {Promise<MasterKategori[]>} Return all kategori object
     */
    @Get("kategori/all")
    public async masterGetKategoriAll(): Promise<MasterTestKategori[]> {
        return await this.masterTestInventoryService.masterGetKategoriAll(2022);
    }

    /**
     * @description Get all barang object based on category id
     * @param {Number} category_id - The category id
     * @returns {Promise<MasterBarang[]>} Return all barang object
     */
    @Get("kategori/:category_id/barang/all")
    public async masterGetBarangAllByKategoriId(
        @Param("category_id", new ParseIntPipe()) category_id: number
    ): Promise<MasterTestBarang[]> {
        return await this.masterTestInventoryService.masterGetBarangAllByKategoriId(2022, category_id);
    }

    /**
     * @description Get kategori object based on category id
     * @param {Number} category_id - The category id
     * @returns {Promise<MasterKategori>} Return kategori object
     */
    @Get("kategori/:category_id")
    public async masterGetKategoriByKategoriId(
        @Param("category_id", new ParseIntPipe()) category_id: number
    ): Promise<MasterTestKategori> {
        return await this.masterTestInventoryService.masterGetKategoriByKategoriId(2022, category_id);
    }

    /**
     * @description Get barang object based on category id and item id
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @returns {Promise<MasterBarang>} Return barang object
     */
    @Get("kategori/:category_id/barang/:item_id")
    public async masterGetBarangByKategoriIdAndBarangId(
        @Param("category_id", new ParseIntPipe()) category_id: number,
        @Param("item_id", new ParseIntPipe()) item_id: number
    ): Promise<MasterTestBarang> {
        return await this.masterTestInventoryService.masterGetBarangByKategoriIdAndBarangId(2022, category_id, item_id);
    }

    /**
     * @description Get the name of category object based on category id
     * @param {Number} category_id - The category id
     * @returns {Promise<string>} Return the name of category object
     */
    @Get("kategori/:category_id/name")
    public async masterGetKategoriNameByKategoriId(
        @Param("category_id", new ParseIntPipe()) category_id: number
    ): Promise<string> {
        return await this.masterTestInventoryService.masterGetKategoriNameByKategoriId(2022, category_id);
    }

    /**
     * @description Get the name of item object based on category id and item id
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @returns {Promise<string>} Return the name of item object
     */
    @Get("kategori/:category_id/barang/:item_id/name")
    public async masterGetBarangNameByKategoriIdAndBarangId(
        @Param("category_id", new ParseIntPipe()) category_id: number,
        @Param("item_id", new ParseIntPipe()) item_id: number
    ): Promise<string> {
        return await this.masterTestInventoryService.masterGetBarangNameByKategoriIdAndBarangId(
            2022,
            category_id,
            item_id
        );
    }

    /**
     * @description Create a new kategori object
     * @param {String} kategori - The new kategori
     * @returns {Promise<MasterKategori>} Return the new kategori object
     */
    @Post("new/kategori")
    public async masterCreateKategori(@Body("kategori") kategori: string): Promise<MasterTestKategori> {
        let new_kategori: MasterTestKategori = {
            id: await this.masterTestInventoryService.masterGetNewKategoriId(2022),
            kategori: kategori,
            created_at: this.utilsService.currentDate(),
            updated_at: this.utilsService.currentDate(),
            barang: [],
        };

        return await this.masterTestInventoryService.masterCreateKategori(2022, new_kategori);
    }

    /**
     * @description Create a new barang object
     * @param {ParameterMasterCreateItemDto} body - The new barang data
     * @returns {Promise<MasterBarang>} Return the new barang object
     */
    @Post("new/barang")
    public async masterCreateBarang(@Body() body: ParameterMasterTestCreateItemDto): Promise<MasterTestBarang> {
        let kategori_id = body.kategori_id;

        let new_barang: MasterTestBarang = {
            id: await this.masterTestInventoryService.masterGetNewBarangIdByKategoriId(2022, kategori_id),
            nama: body.nama,
            satuan: body.satuan,
            created_at: this.utilsService.currentDate(),
            updated_at: this.utilsService.currentDate(),
            saldo_jumlah_satuan: body.saldo_jumlah_satuan,
            mutasi_barang_masuk_jumlah_satuan: body.mutasi_barang_masuk_jumlah_satuan,
            mutasi_barang_keluar_jumlah_satuan: body.mutasi_barang_keluar_jumlah_satuan,
            saldo_akhir_jumlah_satuan: this.utilsService.calculateSaldoAkhirJumlahSatuan(
                body.saldo_jumlah_satuan,
                body.mutasi_barang_masuk_jumlah_satuan,
                body.mutasi_barang_keluar_jumlah_satuan
            ),
            jumlah_permintaan: 0,
            harga_satuan: body.harga_satuan,
            keterangan: body.keterangan,
        };

        return await this.masterTestInventoryService.masterCreateBarang(2022, kategori_id, new_barang);
    }

    /**
     * @description Update kategori object based on category id
     * @param {Number} category_id - The category id
     * @param {String} kategori - The kategori
     * @returns {Promise<MasterKategori>} Return the updated kategori object
     */
    @Put("kategori/:category_id")
    public async masterUpdateKategoriByKategoriId(
        @Param("category_id", new ParseIntPipe()) category_id: number,
        @Body("kategori") kategori: string
    ): Promise<MasterTestKategori> {
        return await this.masterTestInventoryService.masterUpdateKategoriByKategoriId(2022, category_id, kategori);
    }

    /**
     * @description Update barang object based on category id and item item id
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @param {ParameterMasterUpdateItemDto} body - The barang data
     * @returns {Promise<MasterBarang>} Return the updated barang object
     */
    @Put("kategori/:category_id/barang/:item_id")
    public async masterUpdateBarangByKategoriIdAndItemId(
        @Param("category_id", new ParseIntPipe()) category_id: number,
        @Param("item_id", new ParseIntPipe()) item_id: number,
        @Body() body: ParameterMasterTestUpdateItemDto
    ): Promise<MasterTestBarang> {
        let barang: ParameterMasterTestUpdateItemDto = {
            nama: body.nama,
            satuan: body.satuan,
            saldo_jumlah_satuan: body.saldo_jumlah_satuan,
            mutasi_barang_masuk_jumlah_satuan: body.mutasi_barang_masuk_jumlah_satuan,
            mutasi_barang_keluar_jumlah_satuan: body.mutasi_barang_keluar_jumlah_satuan,
            harga_satuan: body.harga_satuan,
            keterangan: body.keterangan,
        };

        return await this.masterTestInventoryService.masterUpdateBarangByKategoriIdAndItemId(
            2022,
            category_id,
            item_id,
            barang
        );
    }

    /**
     * @description Delete kategori object based on category id
     * @param {Number} category_id - The category id
     * @returns {Promise<MasterKategori>} Return the deleted kategori object
     */
    @Delete("kategori/:category_id")
    public async masterDeleteKategoriByKategoriId(
        @Param("category_id", new ParseIntPipe()) category_id: number
    ): Promise<MasterTestKategori> {
        return await this.masterTestInventoryService.masterDeleteKategoriByKategoriId(2022, category_id);
    }

    /**
     * @description Delete barang object based on category id and item id
     * @param {Number} category_id - The category id
     * @param {Number} item_id - The item id
     * @returns {Promise<MasterBarang>} Return the deleted barang object
     */
    @Delete("kategori/:category_id/barang/:item_id")
    public async masterDeleteBarangByKategoriIdAndBarangId(
        @Param("category_id", new ParseIntPipe()) category_id: number,
        @Param("item_id", new ParseIntPipe()) item_id: number
    ): Promise<MasterTestBarang> {
        return await this.masterTestInventoryService.masterDeleteBarangByKategoriIdAndBarangId(
            2022,
            category_id,
            item_id
        );
    }

    //#endregion crud
}
