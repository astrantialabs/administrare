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

import { Controller, Get, Render, Sse, UseFilters, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { interval, map, Observable } from "rxjs";
import * as os from "os";
import * as v8 from "v8";

import { ViewAuthFilter } from "./authentication/filters/view-auth.filter";
import { ParamsInterceptor } from "./common/interceptors/params.interceptor";

export interface MessageEvent {
    data: string | object;
}

@Controller()
export class AppController {
    constructor() {}

    @Get("")
    @Render("dashboard/main")
    @UseInterceptors(ParamsInterceptor)
    public index() {
        return {};
    }

    @Get("status")
    @Render("dashboard/status")
    @UseInterceptors(ParamsInterceptor)
    public dashboard_status(): {} {
        return {};
    }

    @Get("inventory")
    @Render("dashboard/inventory/main")
    @UseInterceptors(ParamsInterceptor)
    public dashboard_inventory_main(): {} {
        return {};
    }

    @Sse("event")
    public event_index(): Observable<MessageEvent> {
        return interval(1000).pipe(
            map(() => {
                return {
                    data: {
                        memory: {
                            rss: ((process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
                            heapTotal: ((v8.getHeapStatistics().total_heap_size / 1024 / 1024) * 100) / 100,
                            heapUsed: ((v8.getHeapStatistics().used_heap_size / 1024 / 1024) * 100) / 100,
                            external: ((process.memoryUsage().external / 1024 / 1024) * 100) / 100,
                        },
                        loadAverage: os.loadavg(),
                        rps: process.cpuUsage(),
                    },
                };
            })
        );
    }
}
