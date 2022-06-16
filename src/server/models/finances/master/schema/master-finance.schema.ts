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
 * @fileoverview The master finance schema.
 * @author Rizky Irswanda <rizky.irswanda115@gmail.com>
 */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export type MasterFinanceDataDocument = MasterFinanceData & Document;

export class MasterKeuanganRealisasi {
    @Prop({ type: MongooseSchema.Types.Number, required: false })
    total: number | null;

    @Prop({ type: MongooseSchema.Types.Number, required: false })
    note: string | null;
}

export class MasterKeuanganTarget {
    @Prop({ type: MongooseSchema.Types.Number, required: false })
    total: number | null;

    @Prop({ type: MongooseSchema.Types.Number, required: false })
    note: string | null;
}

export class MasterKeuanganJumlahKebutuhanDana {
    @Prop({ type: MongooseSchema.Types.Number, required: true })
    id: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: "MasterKeuanganTarget" })
    target: MasterKeuanganTarget;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: "MasterKeuanganRealisasi" })
    realisasi: MasterKeuanganRealisasi;
}

export class MasterKeuangan {
    @Prop({ type: MongooseSchema.Types.String, required: true })
    jumlah_anggaran: string;

    @Prop({ type: MongooseSchema.Types.Array, required: true, ref: "MasterKeuanganJumlahKebutuhanDana" })
    jumlah_Kebutuhan_dana: MasterKeuanganJumlahKebutuhanDana[];
}

export class MasteFisikRealisasi {
    @Prop({ type: MongooseSchema.Types.Number, required: false })
    total: number | null;

    @Prop({ type: MongooseSchema.Types.Number, required: false })
    note: string | null;
}

export class MasterFisikTarget {
    @Prop({ type: MongooseSchema.Types.Number, required: false })
    total: number | null;

    @Prop({ type: MongooseSchema.Types.Number, required: false })
    note: string | null;
}

export class MasterFisikJumlahKebutuhanDana {
    @Prop({ type: MongooseSchema.Types.Number, required: true })
    id: number;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: "MasterFisikTarget" })
    target: MasterFisikTarget;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: "MasteFisikRealisasi" })
    realisasi: MasteFisikRealisasi;
}

export class MasterFisik {
    @Prop({ type: MongooseSchema.Types.String, required: true })
    jumlah_fisik: string;

    @Prop({ type: MongooseSchema.Types.Array, required: true, ref: "MasterFisikJumlahKebutuhanDana" })
    jumlah_Kebutuhan_dana: MasterFisikJumlahKebutuhanDana[];
}

export class MasterBiaya {
    @Prop({ type: MongooseSchema.Types.Number, required: true })
    id: number;

    @Prop({ type: MongooseSchema.Types.String, required: true })
    biaya: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: "MasterFisik" })
    fisik: MasterFisik;

    @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: "MasterKeuangan" })
    keuangan: MasterKeuangan;
}

export class MasterJumlahKebutuhanDana {
    @Prop({ type: MongooseSchema.Types.Number, required: true })
    id: number;

    @Prop({ type: MongooseSchema.Types.Number, required: false })
    total: number | null;

    @Prop({ type: MongooseSchema.Types.Number, required: false })
    note: string | null;
}

export class MasterDetail {
    @Prop({ type: MongooseSchema.Types.Number, required: true })
    id: number;

    @Prop({ type: MongooseSchema.Types.String, required: true })
    rekening: string;

    @Prop({ type: MongooseSchema.Types.Number, required: true })
    jumlah_fisik_anggaran: number;

    @Prop({ type: MongooseSchema.Types.Array, required: true, ref: "MasterJumlahKebutuhanDana" })
    jumlah_Kebutuhan_dana: MasterJumlahKebutuhanDana[];

    @Prop({ type: MongooseSchema.Types.Array, required: true, ref: "MasterBiaya" })
    biaya: MasterBiaya[];
}

export class MasterSubKegiatan {
    @Prop({ type: MongooseSchema.Types.Number, required: true })
    id: number;

    @Prop({ type: MongooseSchema.Types.String, required: true })
    sub_kegiatan: string;

    @Prop({ type: MongooseSchema.Types.Number, required: false })
    fisik: number | null;

    @Prop({ type: MongooseSchema.Types.Number, required: false })
    keuangan: number | null;

    @Prop({ type: MongooseSchema.Types.Array, required: true, ref: "MasterDetail" })
    detail: MasterDetail[];
}

export class MasterDivisi {
    @Prop({ type: MongooseSchema.Types.Number, required: true })
    id: number;

    @Prop({ type: MongooseSchema.Types.String, required: true })
    divisi: string;

    @Prop({ type: MongooseSchema.Types.Array, required: true, ref: "MasterSubKegiatan" })
    sub_kegiatan: MasterSubKegiatan[];
}

@Schema()
export class MasterFinanceData {
    @Prop({ type: MongooseSchema.Types.Number, required: true })
    id: number;

    @Prop({ type: MongooseSchema.Types.Number, required: true })
    tahun: number;

    @Prop({ type: MongooseSchema.Types.Array, required: true, ref: "MasterDivisi" })
    divisi: MasterDivisi[];
}

export const MasterFinanceDataSchema = SchemaFactory.createForClass(MasterFinanceData);
