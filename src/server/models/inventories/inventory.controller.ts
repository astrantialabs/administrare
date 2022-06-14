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
    @Render("inventory/master/main")
    @UseInterceptors(ParamsInterceptor)
    public inventoryMasterMain(): {} {
        return {};
    }

    /* -------------------------------------------------------------------------- */
    /*                              INVENTORY REQUEST                             */
    /* -------------------------------------------------------------------------- */

    @Get("request")
    @Render("inventory/request/user/main")
    @UseInterceptors(ParamsInterceptor)
    public inventoryRequestMain(): {} {
        return {};
    }

    @Get("request/manage")
    @Render("inventory/request/manage/main")
    @UseInterceptors(ParamsInterceptor)
    public inventoryRequestManageMain(): {} {
        return {};
    }

    @Get("request/create/barang")
    @Render("inventory/request/manage/create/item")
    @UseInterceptors(ParamsInterceptor)
    public inventoryRequestCreateBarang(): {} {
        return {};
    }

    /* -------------------------------------------------------------------------- */
    /*                              INVENTORY DEMAND                              */
    /* -------------------------------------------------------------------------- */

    @Get("demand")
    @Render("inventory/demand/user/main")
    @UseInterceptors(ParamsInterceptor)
    public inventoryDemandMain(): {} {
        return {};
    }

    @Get("demand/create/kategori")
    @Render("inventory/demand/manage/create/category")
    @UseInterceptors(ParamsInterceptor)
    public inventoryDemandCreateKategori(): {} {
        return {};
    }

    @Get("demand/create/barang")
    @Render("inventory/demand/manage/create/item")
    @UseInterceptors(ParamsInterceptor)
    public inventoryDemandCreateBarang(): {} {
        return {};
    }

    @Get("demand/manage")
    @Render("inventory/demand/manage/main")
    @UseInterceptors(ParamsInterceptor)
    public inventoryDemandManageMain(): {} {
        return {};
    }

    @Get("demand/manage/create/kategori")
    @Render("inventory/demand/manage/create/category")
    @UseInterceptors(ParamsInterceptor)
    public inventoryDemandManageCreateKategori(): {} {
        return {};
    }

    @Get("demand/manage/create/barang")
    @Render("inventory/demand/manage/create/item")
    @UseInterceptors(ParamsInterceptor)
    public inventoryDemandManageCreateBarang(): {} {
        return {};
    }
}
