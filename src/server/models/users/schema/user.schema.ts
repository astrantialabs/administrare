/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/**
 * @fileoverview The configuration service.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";

import { PermissionLevel } from "@shared/typings/enumerations/permission-level.enum";

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
