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

import { InjectModel } from "@nestjs/mongoose";
import { PermissionLevel } from "@shared/typings/enumerations/permission-level.enum";
import { Model } from "mongoose";
import { User, UserDocument } from "./schema/user.schema";

/**
 * @fileoverview User service.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */
export class UserService {
    /**
     * @constructor The user service.
     * @param {MongoDBProviderModule} mongoDBProviderModule - The mongoDB provider module.
     */
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

    /**
     * @description Creates a new user.
     * @param  {User} user - The new user information.
     * @returns {Promise<UserDocument>} The created user.
     */
    public async create(user: User): Promise<UserDocument> {
        return this.userModel.create(user);
    }

    /**
     * @description Finds all users.
     * @returns {Promise<UserDocument[]>} The users.
     */
    public async findAll(): Promise<UserDocument[]> {
        return this.userModel.find().exec();
    }

    /**
     * @description Finds a user by their username.
     * @param username - The user's username.
     * @returns {Promise<UserDocument | null>} The user.
     */
    public async findOne(username: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ username }).exec();
    }

    /**
     * @description Finds a user by their id.
     * @param id - The user's id.
     * @returns {Promise<UserDocument | null>} The user.
     */
    public async findOneById(id: string): Promise<UserDocument | null> {
        return this.userModel.findById(id).exec();
    }

    /**
     * @description Updates the user's information.
     * @param {String} id - The user's id.
     * @param {User} user - The new user information.
     * @returns {Promise<UserDocument | null>} The updated user.
     */
    public async update(id: string, user: User): Promise<UserDocument | null> {
        return this.userModel.findByIdAndUpdate(id, user, { new: true }).exec();
    }

    /**
     * @description Updates the user's permission level.
     * @param {String} id - The user's id.
     * @param {PermissionLevel} permissionLevel - The new permission level.
     * @returns {Promise<UserDocument | null>} The updated user.
     */
    public async updatePermissionLevel(id: string, permissionLevel: PermissionLevel): Promise<UserDocument | null> {
        return this.userModel.findByIdAndUpdate(id, { permissionLevel }, { new: true }).exec();
    }
}
