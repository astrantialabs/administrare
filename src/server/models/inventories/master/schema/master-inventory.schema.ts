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

/**
 * @fileoverview The master inventory schema.
 * @author Rizky Irswanda <rizky.irswanda115@gmail.com>
 */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export type MasterInventoryDataDocument = MasterInventoryData & Document;

export class MasterBarang {
    @Prop({ type: MongooseSchema.Types.Number, required: true })
    id: number;

    @Prop({ type: MongooseSchema.Types.String, required: true, default: "-" })
    nama: string;

    @Prop({ type: MongooseSchema.Types.String, required: true, default: "-" })
    satuan: string;

    @Prop({ type: MongooseSchema.Types.String, required: true })
    created_at: string;

    @Prop({ type: MongooseSchema.Types.String, required: true })
    updated_at: string;

    @Prop({ type: MongooseSchema.Types.Number, required: true })
    saldo_jumlah_satuan: number;

    @Prop({ type: MongooseSchema.Types.Number, required: true })
    mutasi_barang_masuk_jumlah_satuan: number;

    @Prop({ type: MongooseSchema.Types.Number, required: true })
    mutasi_barang_keluar_jumlah_satuan: number;

    @Prop({ type: MongooseSchema.Types.Number, required: true })
    saldo_akhir_jumlah_satuan: number;

    @Prop({ type: MongooseSchema.Types.Number, required: true })
    jumlah_permintaan: number;

    @Prop({ type: MongooseSchema.Types.Number, required: true })
    harga_satuan: number;

    @Prop({ type: MongooseSchema.Types.String, required: false })
    keterangan: string | null;

    @Prop({ type: MongooseSchema.Types.Boolean, required: true })
    active: boolean;
}

export class MasterKategori {
    [x: string]: any;
    @Prop({ type: MongooseSchema.Types.Number, required: true })
    id: number;

    @Prop({ type: MongooseSchema.Types.String, required: true })
    kategori: string;

    @Prop({ type: MongooseSchema.Types.String, required: true })
    rekening: string | null;

    @Prop({ type: MongooseSchema.Types.String, required: true })
    created_at: string;

    @Prop({ type: MongooseSchema.Types.String, required: true })
    updated_at: string;

    @Prop({ type: MongooseSchema.Types.Array, required: true, ref: "MasterBarang" })
    barang: MasterBarang[];

    @Prop({ type: MongooseSchema.Types.Boolean, required: true })
    active: boolean;
}

@Schema()
export class MasterInventoryData {
    @Prop({ type: MongooseSchema.Types.Number, required: true })
    id: number;

    @Prop({ type: MongooseSchema.Types.Number, required: true })
    tahun: number;

    @Prop({ type: MongooseSchema.Types.Array, required: true, ref: "Masterategori" })
    kategori: MasterKategori[];
}

export const MasterInventoryDataSchema = SchemaFactory.createForClass(MasterInventoryData);
