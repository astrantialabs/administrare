/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/**
 * @fileoverview The inventory service.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { InventoryData, InventoryDataDocument } from "./schema/inventory.schema";

/**
 * @class InventoryService
 * @description Inventory service.
 */
@Injectable()
export class InventoryService {
    /**
     * @constructor
     * @description Creates a new inventory data service.
     * @param {Model} inventoryDataModel - The data model.
     */
    constructor(@InjectModel(InventoryData.name) private readonly inventoryDataModel: Model<InventoryDataDocument>) {}

    /**
     * @description Finds all data.
     * @returns {Promise<InventoryDataDocument[]>} The data.
     */
    public async findAll(): Promise<InventoryDataDocument[]> {
        return this.inventoryDataModel.find().exec();
    }

    /**
     * @description Finds a data by its year.
     * @param {Number} year - The year.
     * @returns {Promise<InventoryDataDocument>}
     */
    public async findOne(year: number): Promise<InventoryDataDocument> {
        return this.inventoryDataModel.findOne({ year }).exec();
    }
}
