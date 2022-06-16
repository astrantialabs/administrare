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

import { Controller, Get, Render, UseFilters, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { ParamsInterceptor } from "@/server/common/interceptors/params.interceptor";
import { ViewAuthFilter } from "@/server/authentication/filters/view-auth.filter";

@Controller("inventory")
export class InventoryController {
    constructor() {}

    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @Get("")
    @Render("inventory/master/user/main")
    @UseInterceptors(ParamsInterceptor)
    public inventoryMasterMain(): {} {
        return {};
    }

    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @Get("manage")
    @Render("inventory/master/manage/main")
    @UseInterceptors(ParamsInterceptor)
    public inventoryMasterManageMain(): {} {
        return {};
    }

    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @Get("create/barang")
    @Render("inventory/master/manage/create/item")
    @UseInterceptors(ParamsInterceptor)
    public inventoryMasterCreateBarang(): {} {
        return {};
    }

    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @Get("create/kategori")
    @Render("inventory/master/manage/create/category")
    @UseInterceptors(ParamsInterceptor)
    public inventoryMasterCreateKategori(): {} {
        return {};
    }

    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @Get("update/kategori/:category_id")
    @Render("inventory/master/manage/update/category")
    @UseInterceptors(ParamsInterceptor)
    public inventoryMasterUpdateKategori(): {} {
        return {};
    }

    @Get("update/kategori/:category_id/barang/:item_id")
    @Render("inventory/master/manage/update/item")
    @UseInterceptors(ParamsInterceptor)
    public inventoryMasterUpdateBarang(): {} {
        return {};
    }

    /* -------------------------------------------------------------------------- */
    /*                              INVENTORY REQUEST                             */
    /* -------------------------------------------------------------------------- */

    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @Get("request")
    @Render("inventory/request/user/main")
    @UseInterceptors(ParamsInterceptor)
    public inventoryRequestMain(): {} {
        return {};
    }

    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @Get("request/manage")
    @Render("inventory/request/manage/main")
    @UseInterceptors(ParamsInterceptor)
    public inventoryRequestManageMain(): {} {
        return {};
    }

    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @Get("request/create/barang")
    @Render("inventory/request/manage/create/item")
    @UseInterceptors(ParamsInterceptor)
    public inventoryRequestCreateBarang(): {} {
        return {};
    }

    /* -------------------------------------------------------------------------- */
    /*                              INVENTORY DEMAND                              */
    /* -------------------------------------------------------------------------- */

    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @Get("demand")
    @Render("inventory/demand/user/main")
    @UseInterceptors(ParamsInterceptor)
    public inventoryDemandMain(): {} {
        return {};
    }

    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @Get("demand/create/kategori")
    @Render("inventory/demand/manage/create/category")
    @UseInterceptors(ParamsInterceptor)
    public inventoryDemandCreateKategori(): {} {
        return {};
    }

    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @Get("demand/create/barang")
    @Render("inventory/demand/manage/create/item")
    @UseInterceptors(ParamsInterceptor)
    public inventoryDemandCreateBarang(): {} {
        return {};
    }

    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @Get("demand/manage")
    @Render("inventory/demand/manage/main")
    @UseInterceptors(ParamsInterceptor)
    public inventoryDemandManageMain(): {} {
        return {};
    }

    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @Get("demand/manage/create/kategori")
    @Render("inventory/demand/manage/create/category")
    @UseInterceptors(ParamsInterceptor)
    public inventoryDemandManageCreateKategori(): {} {
        return {};
    }

    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @Get("demand/manage/create/barang")
    @Render("inventory/demand/manage/create/item")
    @UseInterceptors(ParamsInterceptor)
    public inventoryDemandManageCreateBarang(): {} {
        return {};
    }
}
