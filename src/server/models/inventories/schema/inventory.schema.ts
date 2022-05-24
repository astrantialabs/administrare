/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
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
