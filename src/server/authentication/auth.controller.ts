/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/**
 * @fileoverview The jwt strategy.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { LoginPayload } from "@shared/typings/interfaces/login-payload.interface";
import { Response as ExpressResponse, Request as ExpressRequest } from "express";
import { AuthService } from "./auth.service";

@Controller("api/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("user/login")
    public form(
        @Req() request: ExpressRequest,
        @Res({ passthrough: true }) response: ExpressResponse,
        @Body() payload: LoginPayload
    ) {
        return this.authService.login(response, request, payload);
    }

    @Get("user/logout")
    public logout(@Req() request: ExpressRequest, @Res() response: ExpressResponse) {
        return this.authService.logout(response, request);
    }
}
