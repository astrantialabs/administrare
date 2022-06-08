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
import { MasterInventoryService } from "./master-inventory.service";
import { MasterBarang, MasterInventoryDataDocument, MasterKategori } from "./schema/master-inventory.schema";
import { ParameterMasterCreateItemDto, ParameterMasterUpdateItemDto } from "./dto/item.schema";
import { ItemSearchData } from "@/shared/typings/types/inventory";

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
     * @param {UtilsService} utilsService  - The utils service.
     */
    constructor(
        private readonly masterInventoryService: MasterInventoryService,
        private readonly utilsService: UtilsService
    ) {}

    //#region main

    /**
     * @description Find an inventory document based on year
     * @returns {Promise<MasterInventoryDataDocument>} The inventory document
     */
    @Get()
    public async masterFindOne(): Promise<MasterInventoryDataDocument> {
        return this.masterInventoryService.masterFindOne(2022);
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
        return await this.masterInventoryService.masterSearchBarangByName(2022, name);
    }

    //#endregion utility

    //#region crud

    /**
     * @description Get all kategori object
     * @returns {Promise<MasterKategori[]>} Return all kategori object
     */
    @Get("kategori/all")
    public async masterGetKategoriAll(): Promise<MasterKategori[]> {
        return await this.masterInventoryService.masterGetKategoriAll(2022);
    }

    /**
     * @description Get all barang object based on category id
     * @param {Number} category_id - The category id
     * @returns {Promise<MasterBarang[]>} Return all barang object
     */
    @Get("kategori/:category_id/barang/all")
    public async masterGetBarangAllByKategoriId(
        @Param("category_id", new ParseIntPipe()) category_id: number
    ): Promise<MasterBarang[]> {
        return await this.masterInventoryService.masterGetBarangAllByKategoriId(2022, category_id);
    }

    /**
     * @description Get kategori object based on category id
     * @param {Number} category_id - The category id
     * @returns {Promise<MasterKategori>} Return kategori object
     */
    @Get("kategori/:category_id")
    public async masterGetKategoriByKategoriId(
        @Param("category_id", new ParseIntPipe()) category_id: number
    ): Promise<MasterKategori> {
        return await this.masterInventoryService.masterGetKategoriByKategoriId(2022, category_id);
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
    ): Promise<MasterBarang> {
        return await this.masterInventoryService.masterGetBarangByKategoriIdAndBarangId(2022, category_id, item_id);
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
        return await this.masterInventoryService.masterGetKategoriNameByKategoriId(2022, category_id);
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
        return await this.masterInventoryService.masterGetBarangNameByKategoriIdAndBarangId(2022, category_id, item_id);
    }

    /**
     * @description Create a new kategori object
     * @param {String} kategori - The new kategori
     * @returns {Promise<MasterKategori>} Return the new kategori object
     */
    @Post("new/kategori")
    public async masterCreateKategori(@Body("kategori") kategori: string): Promise<MasterKategori> {
        let new_kategori: MasterKategori = {
            id: await this.masterInventoryService.masterGetNewKategoriId(2022),
            kategori: kategori,
            created_at: this.utilsService.currentDate(),
            updated_at: this.utilsService.currentDate(),
            barang: [],
        };

        return await this.masterInventoryService.masterCreateKategori(2022, new_kategori);
    }

    /**
     * @description Create a new barang object
     * @param {ParameterMasterCreateItemDto} body - The new barang data
     * @returns {Promise<MasterBarang>} Return the new barang object
     */
    @Post("new/barang")
    public async masterCreateBarang(@Body() body: ParameterMasterCreateItemDto): Promise<MasterBarang> {
        let kategori_id = body.kategori_id;

        let new_barang: MasterBarang = {
            id: await this.masterInventoryService.masterGetNewBarangIdByKategoriId(2022, kategori_id),
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

        return await this.masterInventoryService.masterCreateBarang(2022, kategori_id, new_barang);
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
    ): Promise<MasterKategori> {
        return await this.masterInventoryService.masterUpdateKategoriByKategoriId(2022, category_id, kategori);
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
        @Body() body: ParameterMasterUpdateItemDto
    ): Promise<MasterBarang> {
        let barang: ParameterMasterUpdateItemDto = {
            nama: body.nama,
            satuan: body.satuan,
            saldo_jumlah_satuan: body.saldo_jumlah_satuan,
            mutasi_barang_masuk_jumlah_satuan: body.mutasi_barang_masuk_jumlah_satuan,
            mutasi_barang_keluar_jumlah_satuan: body.mutasi_barang_keluar_jumlah_satuan,
            harga_satuan: body.harga_satuan,
            keterangan: body.keterangan,
        };

        return await this.masterInventoryService.masterUpdateBarangByKategoriIdAndItemId(
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
    ): Promise<MasterKategori> {
        return await this.masterInventoryService.masterDeleteKategoriByKategoriId(2022, category_id);
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
    ): Promise<MasterBarang> {
        return await this.masterInventoryService.masterDeleteBarangByKategoriIdAndBarangId(2022, category_id, item_id);
    }

    //#endregion crud
}
