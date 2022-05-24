/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/**
 * @fileoverview The user controller.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { Controller, Get, Logger, Param, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/server/authentication/guards/jwt-auth.guard";
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
