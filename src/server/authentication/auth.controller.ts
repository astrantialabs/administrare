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
 * @fileoverview The jwt strategy.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { LoginPayload } from "@/shared/typings/interfaces/login-payload.interface";
import { Response as ExpressResponse, Request as ExpressRequest } from "express";
import { AuthService } from "./auth.service";

@Controller("__api/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("user/login")
    public form(@Req() request: ExpressRequest, @Res({ passthrough: true }) response: ExpressResponse, @Body() payload: LoginPayload) {
        return this.authService.login(response, request, payload);
    }

    @Get("user/logout")
    public logout(@Req() request: ExpressRequest, @Res() response: ExpressResponse) {
        return this.authService.logout(response, request);
    }
}
