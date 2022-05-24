/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/**
 * @fileoverview The Data controller.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { Controller, Get, Logger } from "@nestjs/common";
import { from, Observable, toArray } from "rxjs";

import { InventoryDataPayload } from "@shared/typings/interfaces/inventory-payload.interface";
import { UtilsService } from "../../utils/utils.service";
import { InventoryService } from "./inventory.service";
import { Inventory, InventoryDataDocument } from "./schema/inventory.schema";

/**
 * @class DataController
 * @description The Data controller.
 */
@Controller("api/data/inventory")
export class InventoryController {
    private readonly logger = new Logger(InventoryController.name);

    /**
     * @constructor
     * @description Creates a new data controller.
     * @param {InventoryService} inventoryService - The data service.
     * @param {UtilsService} utilsService  - The utils service.
     */
    constructor(private readonly inventoryService: InventoryService, private readonly utilsService: UtilsService) {}

    /**
     * @description Find all data.
     * @returns {Promise<InventoryDataDocument[]>} The data.
     */
    @Get("")
    public async findAll(): Promise<InventoryDataDocument[]> {
        return this.inventoryService.findAll();
    }

    /**
     * @description Finds all data and format it for table display.
     * @return {Promise<Observable<InventoryDataPayload[]>>} The data.
     */
    @Get("table")
    public async findAllAndFormatToTable(): Promise<Observable<InventoryDataPayload[]>> {
        try {
            const data = await this.inventoryService.findAll();
            let table_data: InventoryDataPayload[] = [];

            data.forEach((data_item) => {
                data_item.inventory.forEach((inventory_item, inventory_index) => {
                    table_data.push({
                        no: this.utilsService.romanizeNumber(inventory_index + 1),
                        uraian_barang: inventory_item.kategori,
                        satuan: "",
                        saldo_jumlah_satuan: "",
                        saldo_harga_satuan: "",
                        saldo_jumlah: "",
                        mutasi_barang_masuk_jumlah_satuan: "",
                        mutasi_barang_masuk_harga_satuan: "",
                        mutasi_barang_masuk_jumlah: "",
                        mutasi_barang_keluar_jumlah_satuan: "",
                        mutasi_barang_keluar_harga_satuan: "",
                        mutasi_barang_keluar_jumlah: "",
                        saldo_akhir_jumlah_satuan: "",
                        saldo_akhir_harga_satuan: "",
                        saldo_akhir_jumlah: "",
                        isCategory: true,
                    });

                    if (inventory_item.barang.length === 0) return;

                    inventory_item.barang.forEach((barang_item, barang_index) => {
                        table_data.push({
                            no: barang_index + 1,
                            uraian_barang: barang_item.nama,
                            satuan: barang_item.satuan,
                            saldo_jumlah_satuan: this.utilsService.isNull(barang_item.saldo.jumlah_satuan),
                            saldo_harga_satuan: this.utilsService.isNull(barang_item.saldo.harga_satuan),
                            saldo_jumlah: this.utilsService
                                .isNull(barang_item.saldo.jumlah_satuan * barang_item.saldo.harga_satuan)
                                .toString(),
                            mutasi_barang_masuk_jumlah_satuan: this.utilsService.isNull(
                                barang_item.mutasi_barang_masuk.jumlah_satuan
                            ),
                            mutasi_barang_masuk_harga_satuan: this.utilsService.isNull(
                                barang_item.mutasi_barang_masuk.harga_satuan
                            ),
                            mutasi_barang_masuk_jumlah: this.utilsService.multiply(
                                barang_item.mutasi_barang_masuk.jumlah_satuan,
                                barang_item.mutasi_barang_masuk.harga_satuan
                            ),
                            mutasi_barang_keluar_jumlah_satuan: this.utilsService.isNull(
                                barang_item.mutasi_barang_keluar.jumlah_satuan
                            ),
                            mutasi_barang_keluar_harga_satuan: this.utilsService.isNull(
                                barang_item.mutasi_barang_keluar.harga_satuan
                            ),
                            mutasi_barang_keluar_jumlah: this.utilsService.multiply(
                                barang_item.mutasi_barang_keluar.jumlah_satuan,
                                barang_item.mutasi_barang_keluar.harga_satuan
                            ),
                            saldo_akhir_jumlah_satuan: this.utilsService.isNull(barang_item.saldo_akhir.jumlah_satuan),
                            saldo_akhir_harga_satuan: this.utilsService.isNull(barang_item.saldo_akhir.harga_satuan),
                            saldo_akhir_jumlah: this.utilsService.multiply(
                                barang_item.saldo_akhir.jumlah_satuan,
                                barang_item.saldo_akhir.harga_satuan
                            ),
                            isCategory: false,
                        });
                    });
                });
            });

            return from(table_data).pipe(toArray());
        } catch (error) {
            this.logger.error(error);
        }
    }

    /**
     * @description Finds all data categories
     * @returns {Promise<string[]>} The data categories.
     */
    @Get("categories")
    public async findAllCategories(): Promise<Observable<string[]>> {
        const data = await this.inventoryService.findAll();
        let categories: string[] = [];

        data.forEach(async (inventoryItem: InventoryDataDocument) => {
            inventoryItem.inventory.forEach(async (item: Inventory) => {
                categories.push(item.kategori);
            });
        });

        return from(categories).pipe(toArray());
    }
}
