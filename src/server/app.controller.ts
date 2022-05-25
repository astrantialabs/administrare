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
 * @fileoverview The app controller.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { Controller, Get, Render, UseInterceptors } from "@nestjs/common";

import { ParamsInterceptor } from "./common/interceptors/params.interceptor";

@Controller()
export class AppController {
    constructor() {}

    @Get("")
    @Render("index")
    @UseInterceptors(ParamsInterceptor)
    public index() {
        return {};
    }

    @Get("inventory")
    @Render("inventory/main")
    @UseInterceptors(ParamsInterceptor)
    public inventory_index() {
        return {};
    }

    @Get("inventory/actions/barang/create")
    @Render("inventory/actions/barang/create")
    @UseInterceptors(ParamsInterceptor)
    public inventory_actions_barang_create(): {} {
        return {};
    }

    @Get("inventory/actions/kategori/create")
    @Render("inventory/actions/kategori/create")
    @UseInterceptors(ParamsInterceptor)
    public inventory_actions_kategori_create(): {} {
        return {};
    }
}
