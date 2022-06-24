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

import { DemandBarang } from "@/server/models/inventories/demand/schema/demand-inventory.schema";
import { RequestBarang } from "@/server/models/inventories/request/schema/request-inventory.schema";

export type JumlahData = {
    saldo_akhir: number;
    permintaan: number;
};

export type ItemSearchData = {
    category_id: number;
    category_name: string;
    item_id: number;
    item_name: string;
    item_unit: string;
    item_saldo_remainder: number;
    total_match: number;
};

export type DemandBarangWithCategoryName = DemandBarang & { kategori_name: string };

export type DemandCreateKategori = {
    username: string;
    kategori: string;
};

export type DemandCreateBarang = {
    kategori_id: number;
    username: string;
    barang: string;
    satuan: string;
};

export type RequestBarangExtended = RequestBarang & { kategori_name: string; barang_name: string; barang_unit: string };

export type RequestCreateBarang = {
    kategori_id: number;
    barang_id: number;
    username: string;
    total: number;
    deskripsi: string | null;
};

export type MasterParameterKategori = {
    kategori: string;
};

export type MasterParameterBarang = {
    kategori_id: number;
    nama: string;
    satuan: string;
    saldo_jumlah_satuan: number;
    mutasi_barang_masuk_jumlah_satuan: number;
    mutasi_barang_keluar_jumlah_satuan: number;
    harga_satuan: number;
    keterangan: string | null;
};

export type MasterParameterDependency = {
    semester: number;
    tanggal_awal: number;
    bulan_awal: number;
    tahun_awal: number;
    tanggal_akhir: number;
    bulan_akhir: number;
    tahun_akhir: number;
    pengurus_barang_pengguna: string;
    plt_kasubag_umum: string;
    sekretaris_dinas: string;
    kepala_dinas_ketenagakerjaan: string;
};

export type MasterTotal = {
    saldo: number;
    mutasi_barang_masuk: number;
    mutasi_barang_keluar: number;
    saldo_akhir: number;
};

export type MasterSubTotal = { category_id: number } & MasterTotal;
