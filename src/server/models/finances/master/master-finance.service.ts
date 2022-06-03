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
 * @fileoverview The master finance service.
 * @author Rizky Irswanda <rizky.irswanda115@gmail.com>
 */

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MasterDivisi, MasterFinanceData, MasterFinanceDataDocument } from "./schema/master-finance.schema";

/**
 * @class MasterFinanceService
 * @description The master finance service.
 */
@Injectable()
export class MasterFinanceService {
    /**
     * @constructor
     * @description Creates a new finance data service
     * @param {Model} masterFinanceDataModel - The master finance model.
     */
    constructor(
        @InjectModel(MasterFinanceData.name)
        private readonly masterFinanceDataModel: Model<MasterFinanceDataDocument>
    ) {}

    /**
     * @description Finds a finance data based on year
     * @param {Number} year - The year
     * @returns {Promise<MasterFinanceDataDocument>} The finance data
     */
    public async masterFindOne(year: number): Promise<MasterFinanceDataDocument> {
        return await this.masterFinanceDataModel.findOne({ tahun: year }).exec();
    }

    /**
     * @description Get division data
     * @param {Number} year - The year data
     * @returns {Promise<MasterDivisi[]} The division data
     */
    public async masterGetDivisiAll(year: number): Promise<MasterDivisi[]> {
        return (await this.masterFindOne(year)).divisi;
    }

    /**
     * @description Get division data based on division name
     * @param {Number} year - The year
     * @param {String} division_name - The division name
     * @returns {Promise<MasterDivisi>} The division data
     */
    public async masterGetDivisiByName(year: number, division_name: string): Promise<MasterDivisi> {
        const master_divisi_data: MasterDivisi[] = await this.masterGetDivisiAll(year);
        let master_divisi: MasterDivisi;

        master_divisi_data.forEach((division_object) => {
            if (division_object.divisi.toLowerCase() == division_name.toLowerCase()) {
                master_divisi = division_object;
            }
        });

        return master_divisi;
    }
}
