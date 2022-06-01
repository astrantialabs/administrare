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

import { IsNotEmpty, IsString, IsOptional, FormikValidatorBase } from "formik-class-validator";
import {
    MasterMutasiBarangKeluar,
    MasterMutasiBarangMasuk,
    MasterSaldo,
    MasterSaldoAkhir,
} from "../schema/master-inventory.schema";

export class ParameterCreateItemDto {
    tahun: number;
    kategori_id: number;
    nama: string;
    satuan: string;
    saldo: MasterSaldo;
    mutasi_barang_masuk: MasterMutasiBarangMasuk;
    mutasi_barang_keluar: MasterMutasiBarangKeluar;
    saldo_akhir: MasterSaldoAkhir;
}

export class FormikCreateDemandBarang extends FormikValidatorBase {
    @IsOptional()
    kategori_id: number;

    @IsNotEmpty({ message: "Username tidak boleh kosong!" })
    @IsString()
    username: string = "";

    @IsNotEmpty({ message: "Nama barang tidak boleh kosong!" })
    @IsString()
    barang: string = "";

    @IsNotEmpty({ message: "Nama satuan barang tidak boleh kosong!" })
    @IsString()
    satuan: string = "";
}

export class FormikCreateBarangModel extends FormikValidatorBase {
    @IsOptional()
    kategori_id: number;

    @IsNotEmpty({ message: "Nama barang tidak boleh kosong!" })
    @IsString()
    nama: string = "";

    @IsNotEmpty({ message: "Nama satuan barang tidak boleh kosong!" })
    @IsString()
    satuan: string = "";

    @IsOptional()
    saldo_jumlah_satuan?: string | null = null;

    @IsOptional()
    saldo_harga_satuan?: string | null = null;

    @IsOptional()
    saldo_akhir_jumlah_satuan?: string | null = null;

    @IsOptional()
    saldo_akhir_harga_satuan?: string | null = null;

    @IsOptional()
    mutasi_barang_masuk_jumlah_satuan?: string | null = null;

    @IsOptional()
    mutasi_barang_masuk_harga_satuan?: string | null = null;

    @IsOptional()
    mutasi_barang_keluar_jumlah_satuan?: string | null = null;

    @IsOptional()
    mutasi_barang_keluar_harga_satuan?: string | null = null;

    constructor(isUpdate: boolean = false, data?: any) {
        super();

        if (isUpdate) {
            data.map((item: any) => {
                this.nama = item.uraian_barang;
                this.satuan = item.satuan;
                this.saldo_jumlah_satuan = item.saldo_jumlah_satuan;
                this.saldo_harga_satuan = item.saldo_harga_satuan;
                this.saldo_akhir_jumlah_satuan = item.saldo_akhir_jumlah_satuan;
                this.saldo_akhir_harga_satuan = item.saldo_akhir_harga_satuan;
                this.mutasi_barang_masuk_jumlah_satuan = item.mutasi_barang_masuk_jumlah_satuan;
                this.mutasi_barang_masuk_harga_satuan = item.mutasi_barang_masuk_harga_satuan;
                this.mutasi_barang_keluar_jumlah_satuan = item.mutasi_barang_keluar_jumlah_satuan;
                this.mutasi_barang_keluar_harga_satuan = item.mutasi_barang_keluar_harga_satuan;
            });
        }
    }
}
