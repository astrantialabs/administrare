/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/**
 * @fileoverview The inventory data payload type interface.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

/**
 * @interface InventoryDataPayload
 * @description The inventory data payload type interface.
 */
export interface InventoryDataPayload {
    no?: any;
    uraian_barang: any;
    satuan: any;
    saldo_jumlah_satuan: any;
    saldo_harga_satuan: any;
    saldo_jumlah: string;
    mutasi_barang_masuk_jumlah_satuan: any;
    mutasi_barang_masuk_harga_satuan: any;
    mutasi_barang_masuk_jumlah: string;
    mutasi_barang_keluar_jumlah_satuan: any;
    mutasi_barang_keluar_harga_satuan: any;
    mutasi_barang_keluar_jumlah: string;
    saldo_akhir_jumlah_satuan: any;
    saldo_akhir_harga_satuan: any;
    saldo_akhir_jumlah: string;
    isCategory: boolean;
}
