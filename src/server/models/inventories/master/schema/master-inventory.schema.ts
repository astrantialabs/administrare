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

export type MasterInventoryDataDocument = MasterInventoryData & Document;

export class MasterMutasiBarangMasuk {
    @Prop({ type: MongooseSchema.Types.Number, required: false, default: null })
    jumlah_satuan: number;

    @Prop({ type: MongooseSchema.Types.Number, required: false, default: null })
    harga_satuan: number;
}

export class MasterMutasiBarangKeluar {
    @Prop({ type: MongooseSchema.Types.Number, required: false, default: null })
    jumlah_satuan: number;

    @Prop({ type: MongooseSchema.Types.Number, required: false, default: null })
    harga_satuan: number;
}

export class MasterSaldo {
    @Prop({ type: MongooseSchema.Types.Number, required: false, default: null })
    jumlah_satuan: number | null;

    @Prop({ type: MongooseSchema.Types.Number, required: false, default: null })
    harga_satuan: number;
}

export class MasterSaldoAkhir {
    @Prop({ type: MongooseSchema.Types.Number, required: false, default: null })
    jumlah_satuan: number;

    @Prop({ type: MongooseSchema.Types.Number, required: false, default: null })
    harga_satuan: number;
}

export class MasterBarang {
    @Prop({ type: MongooseSchema.Types.Number, required: true })
    id: number;

    @Prop({ type: MongooseSchema.Types.String, required: true, default: "-" })
    nama: string;

    @Prop({ type: MongooseSchema.Types.String, required: true, default: "-" })
    satuan: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: false, ref: "MasterSaldo" })
    saldo: MasterSaldo;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: false, ref: "MasterMutasiBarangMasuk" })
    mutasi_barang_masuk: MasterMutasiBarangMasuk;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: false, ref: "MasterMutasiBarangKeluar" })
    mutasi_barang_keluar: MasterMutasiBarangKeluar;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: false, ref: "MasterSaldoAkhir" })
    saldo_akhir: MasterSaldoAkhir;
}

export class MasterInventory {
    [x: string]: any;
    @Prop({ type: MongooseSchema.Types.Number, required: true })
    id: number;

    @Prop({ type: MongooseSchema.Types.String, required: true })
    kategori: string;

    @Prop({ type: MongooseSchema.Types.Array, required: true, ref: "MasterBarang" })
    barang: MasterBarang[];
}

@Schema()
export class MasterInventoryData {
    @Prop({ type: MongooseSchema.Types.Number, required: true })
    id: number;

    @Prop({ type: MongooseSchema.Types.Number, required: true })
    tahun: number;

    @Prop({ type: MongooseSchema.Types.Array, required: true, ref: "MasterInventory" })
    inventory: MasterInventory[];
}

export const MasterInventoryDataSchema = SchemaFactory.createForClass(MasterInventoryData);
