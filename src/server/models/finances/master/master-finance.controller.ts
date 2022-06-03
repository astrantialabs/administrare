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
 * @fileoverview The master finance data controller.
 * @author Rizky Irswanda <rizky.irswanda115@gmail.com>
 */

import { Controller, Get, Param } from "@nestjs/common";
import { MasterFinanceService } from "./master-finance.service";
import { MasterDivisi } from "./schema/master-finance.schema";

/**
 * @class MasterFinanceDataController
 * @description The master finance data controller.
 */
@Controller("__api/data/finance/master")
export class MasterFinanceController {
    /**
     * @description Creates a new master finance data controller.
     * @param {MasterFinanceService} masterFinanceService - The master finance service
     */
    constructor(private readonly masterFinanceService: MasterFinanceService) {}

    /**
     * @description Get division data
     * @returns {Promise<MasterDivisi[]>} The division data
     */
    @Get("get/divisi/all")
    public async masterGetDivisiAll(): Promise<MasterDivisi[]> {
        return await this.masterFinanceService.masterGetDivisiAll(2022);
    }

    /**
     * @description Get division data based on division name
     * @param {String} division_name - The division name
     * @returns {Promise<MasterDivisi>} The division data
     */
    @Get("get/divisi/:division_name")
    public async masterGetDivisiByName(@Param("division_name") division_name: string): Promise<MasterDivisi> {
        return await this.masterFinanceService.masterGetDivisiByName(2022, division_name);
    }
}
