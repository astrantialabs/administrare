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
 * @fileoverview The inventory controller.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { Controller, Get, Render, UseInterceptors } from "@nestjs/common";

import { ParamsInterceptor } from "@/server/common/interceptors/params.interceptor";

@Controller("inventory")
export class InventoryController {
    constructor() {}

    @Get("")
    @Render("dashboard/inventory/main")
    @UseInterceptors(ParamsInterceptor)
    public dashboardInventoryMain(): {} {
        return {};
    }

    @Get("actions")
    @Render("dashboard/inventory/action")
    @UseInterceptors(ParamsInterceptor)
    public dashboardInventoryActions(): {} {
        return {};
    }

    @Get("create/kategori")
    @Render("dashboard/inventory/actions/kategori/create")
    @UseInterceptors(ParamsInterceptor)
    public dashboardInventoryCreateKategori(): {} {
        return {};
    }

    @Get("create/barang")
    @Render("dashboard/inventory/actions/barang/create")
    @UseInterceptors(ParamsInterceptor)
    public dashboardInventoryCreateBarang(): {} {
        return {};
    }

    @Get("demand")
    @Render("dashboard/inventory/demand/main")
    @UseInterceptors(ParamsInterceptor)
    public dashboardInventoryDemandMain(): {} {
        return {};
    }

    @Get("demand/actions")
    @Render("dashboard/inventory/demand/action")
    @UseInterceptors(ParamsInterceptor)
    public dashboardInventoryDemandActions(): {} {
        return {};
    }
}
