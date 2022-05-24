/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
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
