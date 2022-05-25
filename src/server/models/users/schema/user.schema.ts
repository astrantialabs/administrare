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
 * @fileoverview The configuration service.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

import { PermissionLevel } from "@/shared/typings/enumerations/permission-level.enum";

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ type: MongooseSchema.Types.String, required: true })
    username: string;

    @Prop({ type: MongooseSchema.Types.String, required: true })
    password: string;

    @Prop({ type: MongooseSchema.Types.String, required: false })
    name: string;

    @Prop({ type: MongooseSchema.Types.String, default: "USER", enum: Object.values(PermissionLevel) })
    permissionLevel: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
