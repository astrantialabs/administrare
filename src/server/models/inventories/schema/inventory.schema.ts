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
 * @fileoverview The inventory schema.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export type InventoryDataDocument = InventoryData & Document;

export class MutasiBarangMasuk {
    @Prop({ type: MongooseSchema.Types.Number, required: false, default: null })
    jumlah_satuan: number;

    @Prop({ type: MongooseSchema.Types.Number, required: false, default: null })
    harga_satuan: number;
}

export class MutasiBarangKeluar {
    @Prop({ type: MongooseSchema.Types.Number, required: false, default: null })
    jumlah_satuan: number;

    @Prop({ type: MongooseSchema.Types.Number, required: false, default: null })
    harga_satuan: number;
}

export class Saldo {
    @Prop({ type: MongooseSchema.Types.Number, required: false, default: null })
    jumlah_satuan: number | null;

    @Prop({ type: MongooseSchema.Types.Number, required: false, default: null })
    harga_satuan: number;
}

export class SaldoAkhir {
    @Prop({ type: MongooseSchema.Types.Number, required: false, default: null })
    jumlah_satuan: number;

    @Prop({ type: MongooseSchema.Types.Number, required: false, default: null })
    harga_satuan: number;
}

export class Barang {
    @Prop({ type: MongooseSchema.Types.Number, required: true })
    id: number;

    @Prop({ type: MongooseSchema.Types.String, required: true, default: "-" })
    nama: string;

    @Prop({ type: MongooseSchema.Types.String, required: true, default: "-" })
    satuan: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: false, ref: "Saldo" })
    saldo: Saldo;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: false, ref: "MutasiBarangMasuk" })
    mutasi_barang_masuk: MutasiBarangMasuk;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: false, ref: "MutasiBarangKeluar" })
    mutasi_barang_keluar: MutasiBarangKeluar;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: false, ref: "SaldoAkhir" })
    saldo_akhir: SaldoAkhir;
}

export class Inventory {
    [x: string]: any;
    @Prop({ type: MongooseSchema.Types.Number, required: true })
    id: number;

    @Prop({ type: MongooseSchema.Types.String, required: true })
    kategori: string;

    @Prop({ type: MongooseSchema.Types.Array, required: true, ref: "Barang" })
    barang: Barang[];
}

@Schema()
export class InventoryData {
    @Prop({ type: MongooseSchema.Types.Number, required: true })
    id: number;

    @Prop({ type: MongooseSchema.Types.Number, required: true })
    tahun: number;

    @Prop({ type: MongooseSchema.Types.Array, required: true, ref: "Inventory" })
    inventory: Inventory[];
}

export const InventoryDataSchema = SchemaFactory.createForClass(InventoryData);
