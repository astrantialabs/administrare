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

import {
    MasterMutasiBarangKeluar,
    MasterMutasiBarangMasuk,
    MasterSaldo,
    MasterSaldoAkhir,
} from "../schema/master-inventory.schema";

/**
 * @class ParameterCreateItemDto
 */
export class ParameterMasterInventoryCreateBarangDto {
    tahun: number;
    kategori_id: number;
    nama: string;
    satuan: string;
    saldo: MasterSaldo;
    mutasi_barang_masuk: MasterMutasiBarangMasuk;
    mutasi_barang_keluar: MasterMutasiBarangKeluar;
    saldo_akhir: MasterSaldoAkhir;
}

export class ParameterMasterInventoryCreateBarangAlternativeDto {
    kategori_id: number;
    nama: string;
    satuan: string;
    saldo_jumlah_satuan?: string | number;
    saldo_harga_satuan?: string;
    saldo_akhir_jumlah_satuan?: string | null;
    saldo_akhir_harga_satuan?: string | null;
    mutasi_barang_masuk_jumlah_satuan?: string | null;
    mutasi_barang_masuk_harga_satuan?: string | null;
    mutasi_barang_keluar_jumlah_satuan?: string | null;
    mutasi_barang_keluar_harga_satuan?: string | null;
    tahun: number;
}
