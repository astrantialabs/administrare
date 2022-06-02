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
 * @fileoverview The master inventory formik validation.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { IsNotEmpty, IsString, IsOptional, FormikValidatorBase } from "formik-class-validator";

/**
 * @class MasterInventoryBarangCreateFormModel
 * @extends {FormikValidatorBase}
 */
export class MasterInventoryBarangCreateFormModel extends FormikValidatorBase {
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
    saldo_harga_satuan?: string = "";

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

    /**
     * @constructor
     * @description The constructor of the class.
     */
    constructor(isIntialValuesEnabled: boolean = false, data?: any) {
        super();

        if (isIntialValuesEnabled) {
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
