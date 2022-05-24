/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/**
 * @fileoverview The auth module.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { User, UserSchema } from "./schema/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: User.name, schema: UserSchema, collection: process.env.DATABASE_USER_COLLECTION }],
            process.env.DATABASE_USER_CONNECTION_NAME
        ),
    ],
    exports: [UserService],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
