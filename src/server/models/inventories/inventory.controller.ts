/**
 * administrare - web platform for internal data management
 * Copyright (C) 2022 astrantialabs
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
import { PermissionAuthFilter } from "@/server/authentication/filters/permission-auth.filter";
import { ViewAuthFilter } from "@/server/authentication/filters/view-auth.filter";
import { Permission } from "@/server/authentication/decorators/permission.decorator";
import { PermissionLevel } from "@/shared/typings/enumerations/permission-level.enum";

@Controller("inventory")
export class InventoryController {
    constructor() {}

    @Permission(PermissionLevel.USER, PermissionLevel.ADMINISTRATOR, PermissionLevel.SUPERADMINISTRATOR)
    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @UseFilters(PermissionAuthFilter)
    @Get("")
    @Render("inventory/master/user/main")
    @UseInterceptors(ParamsInterceptor)
    public inventoryMasterMain(): {} {
        return {};
    }

    @Permission(PermissionLevel.ADMINISTRATOR, PermissionLevel.SUPERADMINISTRATOR)
    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @UseFilters(PermissionAuthFilter)
    @Get("manage")
    @Render("inventory/master/manage/main")
    @UseInterceptors(ParamsInterceptor)
    public inventoryMasterManageMain(): {} {
        return {};
    }

    @Permission(PermissionLevel.ADMINISTRATOR, PermissionLevel.SUPERADMINISTRATOR)
    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @UseFilters(PermissionAuthFilter)
    @Get("create/barang")
    @Render("inventory/master/manage/create/item")
    @UseInterceptors(ParamsInterceptor)
    public inventoryMasterCreateBarang(): {} {
        return {};
    }

    @Permission(PermissionLevel.ADMINISTRATOR, PermissionLevel.SUPERADMINISTRATOR)
    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @UseFilters(PermissionAuthFilter)
    @Get("create/kategori")
    @Render("inventory/master/manage/create/category")
    @UseInterceptors(ParamsInterceptor)
    public inventoryMasterCreateKategori(): {} {
        return {};
    }

    @Permission(PermissionLevel.ADMINISTRATOR, PermissionLevel.SUPERADMINISTRATOR)
    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @UseFilters(PermissionAuthFilter)
    @Get("update/kategori/:category_id")
    @Render("inventory/master/manage/update/category")
    @UseInterceptors(ParamsInterceptor)
    public inventoryMasterUpdateKategori(): {} {
        return {};
    }

    @Permission(PermissionLevel.ADMINISTRATOR, PermissionLevel.SUPERADMINISTRATOR)
    @Get("update/kategori/:category_id/barang/:item_id")
    @Render("inventory/master/manage/update/item")
    @UseInterceptors(ParamsInterceptor)
    public inventoryMasterUpdateBarang(): {} {
        return {};
    }

    @Permission(PermissionLevel.ADMINISTRATOR, PermissionLevel.SUPERADMINISTRATOR)
    @Get("update/dependency")
    @Render("inventory/master/manage/update/dependency")
    @UseInterceptors(ParamsInterceptor)
    public inventoryMasterUpdateDependency(): {} {
        return {};
    }

    /* -------------------------------------------------------------------------- */
    /*                              INVENTORY REQUEST                             */
    /* -------------------------------------------------------------------------- */

    @Permission(PermissionLevel.USER, PermissionLevel.ADMINISTRATOR, PermissionLevel.SUPERADMINISTRATOR)
    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @UseFilters(PermissionAuthFilter)
    @Get("request")
    @Render("inventory/request/user/main")
    @UseInterceptors(ParamsInterceptor)
    public inventoryRequestMain(): {} {
        return {};
    }

    @Permission(PermissionLevel.ADMINISTRATOR, PermissionLevel.SUPERADMINISTRATOR)
    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @UseFilters(PermissionAuthFilter)
    @Get("request/manage")
    @Render("inventory/request/manage/main")
    @UseInterceptors(ParamsInterceptor)
    public inventoryRequestManageMain(): {} {
        return {};
    }

    @Permission(PermissionLevel.USER, PermissionLevel.ADMINISTRATOR, PermissionLevel.SUPERADMINISTRATOR)
    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @UseFilters(PermissionAuthFilter)
    @Get("request/create/barang")
    @Render("inventory/request/manage/create/item")
    @UseInterceptors(ParamsInterceptor)
    public inventoryRequestCreateBarang(): {} {
        return {};
    }

    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @Get("request/download")
    @Render("inventory/request/download/main")
    @UseInterceptors(ParamsInterceptor)
    public inventoryRequestDownload(): {} {
        return {};
    }

    /* -------------------------------------------------------------------------- */
    /*                              INVENTORY DEMAND                              */
    /* -------------------------------------------------------------------------- */

    @Permission(PermissionLevel.USER, PermissionLevel.ADMINISTRATOR, PermissionLevel.SUPERADMINISTRATOR)
    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @UseFilters(PermissionAuthFilter)
    @Get("demand")
    @Render("inventory/demand/user/main")
    @UseInterceptors(ParamsInterceptor)
    public inventoryDemandMain(): {} {
        return {};
    }

    @Permission(PermissionLevel.USER, PermissionLevel.ADMINISTRATOR, PermissionLevel.SUPERADMINISTRATOR)
    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @UseFilters(PermissionAuthFilter)
    @Get("demand/create/kategori")
    @Render("inventory/demand/manage/create/category")
    @UseInterceptors(ParamsInterceptor)
    public inventoryDemandCreateKategori(): {} {
        return {};
    }

    @Permission(PermissionLevel.USER, PermissionLevel.ADMINISTRATOR, PermissionLevel.SUPERADMINISTRATOR)
    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @UseFilters(PermissionAuthFilter)
    @Get("demand/create/barang")
    @Render("inventory/demand/manage/create/item")
    @UseInterceptors(ParamsInterceptor)
    public inventoryDemandCreateBarang(): {} {
        return {};
    }

    @Permission(PermissionLevel.ADMINISTRATOR, PermissionLevel.SUPERADMINISTRATOR)
    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @UseFilters(PermissionAuthFilter)
    @Get("demand/manage")
    @Render("inventory/demand/manage/main")
    @UseInterceptors(ParamsInterceptor)
    public inventoryDemandManageMain(): {} {
        return {};
    }

    @Permission(PermissionLevel.ADMINISTRATOR, PermissionLevel.SUPERADMINISTRATOR)
    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @UseFilters(PermissionAuthFilter)
    @Get("demand/manage/create/kategori")
    @Render("inventory/demand/manage/create/category")
    @UseInterceptors(ParamsInterceptor)
    public inventoryDemandManageCreateKategori(): {} {
        return {};
    }

    @Permission(PermissionLevel.ADMINISTRATOR, PermissionLevel.SUPERADMINISTRATOR)
    @UseGuards(AuthGuard("jwt"))
    @UseFilters(ViewAuthFilter)
    @UseFilters(PermissionAuthFilter)
    @Get("demand/manage/create/barang")
    @Render("inventory/demand/manage/create/item")
    @UseInterceptors(ParamsInterceptor)
    public inventoryDemandManageCreateBarang(): {} {
        return {};
    }
}
