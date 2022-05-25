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

import { IsNotEmpty, IsString, IsEmpty, IsOptional, IsNumber, FormikValidatorBase } from "formik-class-validator";
import { MutasiBarangKeluar, MutasiBarangMasuk, Saldo, SaldoAkhir } from "../../schema/inventory.schema";

export class ParCreateItemDto {
    tahun: number;
    kategori: string;
    nama: string;
    satuan: string;
    saldo: Saldo;
    mutasi_barang_masuk: MutasiBarangMasuk;
    mutasi_barang_keluar: MutasiBarangKeluar;
    saldo_akhir: SaldoAkhir;
}

export class ResCreateItemDto {
    id?: number;
    nama: string;
    satuan: string;
    saldo: Saldo;
    mutasi_barang_masuk: MutasiBarangMasuk;
    mutasi_barang_keluar: MutasiBarangKeluar;
    saldo_akhir: SaldoAkhir;
}

export class FormikCreateBarangModel extends FormikValidatorBase {
    @IsNotEmpty()
    @IsString({ message: "Field ini diperluhkan!" })
    nama: string = "";

    @IsNotEmpty()
    @IsString({ message: "Field ini diperluhkan!" })
    satuan: string = "";

    @IsOptional()
    @IsString()
    saldo_jumlah_satuan?: string | null = null;

    @IsOptional()
    @IsString()
    saldo_harga_satuan?: string | null = null;

    @IsOptional()
    @IsString()
    saldo_akhir_jumlah_satuan?: string | null = null;

    @IsOptional()
    @IsString()
    saldo_akhir_harga_satuan?: string | null = null;

    @IsOptional()
    @IsString()
    mutasi_barang_masuk_jumlah_satuan?: string | null = null;

    @IsOptional()
    @IsString()
    mutasi_barang_masuk_harga_satuan?: string | null = null;

    @IsOptional()
    @IsString()
    mutasi_barang_keluar_jumlah_satuan?: string | null = null;

    @IsOptional()
    @IsString()
    mutasi_barang_keluar_harga_satuan?: string | null = null;

    @IsString()
    kategori: string = "";
}
