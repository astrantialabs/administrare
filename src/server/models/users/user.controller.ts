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
 * @fileoverview The user controller.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { Controller, Get, Logger, Param, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "../../authentication/guards/jwt-auth.guard";
import { UserService } from "./user.service";

/**
 * @class UserController
 * @description User controller.
 */
@Controller("api/user")
export class UserController {
    private readonly logger = new Logger(UserController.name);

    /**
     * @constructor
     * @description Creates a new user service.
     * @param {UserService} userService - The user service.
     */
    constructor(private userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get("")
    public async findAll() {
        return this.userService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get("id/:id")
    public async findOneById(@Param("id") id: string) {
        return this.userService.findOneById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Get("username/:username")
    public async findOneByUsername(@Param("username") username: string) {
        return this.userService.findOne(username);
    }
}
