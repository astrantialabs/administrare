/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
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
    home() {
        return {
            test: "Hello, world",
        };
    }
}
