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
 * @fileoverview The demand schema.
 * @author Rizky Irswanda <rizky.irswanda115@gmail.com>
 */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

export type DemandInventoryDataDocument = DemandInventoryData & Document;

export class DemandBarang {
    @Prop({ type: MongooseSchema.Types.Number, required: true })
    id: number;

    @Prop({ type: MongooseSchema.Types.Number, required: true })
    kategori_id: number;

    @Prop({ type: MongooseSchema.Types.String, required: true })
    username: string;

    @Prop({ type: MongooseSchema.Types.String, required: true })
    barang: string;

    @Prop({ type: MongooseSchema.Types.Date, required: true })
    createad_at: Date;

    @Prop({ type: MongooseSchema.Types.Date, required: false })
    responded_at: Date | null;

    @Prop({ type: MongooseSchema.Types.Number, required: true })
    status: number;
}

export class DemandKategori {
    @Prop({ type: MongooseSchema.Types.Number, required: true })
    id: number;

    @Prop({ type: MongooseSchema.Types.String, required: true })
    username: string;

    @Prop({ type: MongooseSchema.Types.String, required: true })
    kategori: string;

    @Prop({ type: MongooseSchema.Types.Date, required: true })
    createad_at: Date;

    @Prop({ type: MongooseSchema.Types.Date, required: false })
    responded_at: Date | null;

    @Prop({ type: MongooseSchema.Types.Number, required: true })
    status: number;
}

@Schema()
export class DemandInventoryData {
    @Prop({ type: MongooseSchema.Types.Number, required: true })
    id: number;

    @Prop({ type: MongooseSchema.Types.Number, required: true })
    tahun: number;

    @Prop({ type: MongooseSchema.Types.Array, required: true, ref: "kategori" })
    kategori: DemandKategori[];

    @Prop({ type: MongooseSchema.Types.Array, required: true, ref: "barang" })
    barang: DemandBarang[];
}

export const DemandInventoryDataSchema = SchemaFactory.createForClass(DemandInventoryData);
