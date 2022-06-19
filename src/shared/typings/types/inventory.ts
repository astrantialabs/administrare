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

export type RequestBarangWithCategoryNameAndItemName = RequestBarang & { kategori_name: string; barang_name: string };

export type RequestCreateBarang = {
    kategori_id: number;
    barang_id: number;
    username: string;
    total: number;
    deskripsi: string | null;
};

export type MasterTotal = {
    saldo: number;
    mutasi_barang_masuk: number;
    mutasi_barang_keluar: number;
    saldo_akhir: number;
};

export type MasterSubTotal = { category_id: number } & MasterTotal;
