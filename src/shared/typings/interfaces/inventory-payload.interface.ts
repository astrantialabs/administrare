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
