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
 * @fileoverview The auth service.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Response as ExpressResponse, Request as ExpressRequest } from "express";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { LoginPayload } from "@/shared/typings/interfaces/login-payload.interface";

import { UserService } from "../models/users/user.service";
import { UserDocument } from "../models/users/schema/user.schema";

/**
 * @class AuthService
 * @description Auth service.
 */
@Injectable()
export class AuthService {
    /**
     * @constructor
     * @description Creates a new auth service.
     * @param {UserService} userService - The user service.
     * @param {JwtService} jwtService - The jwt service.
     */
    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

    /**
     * @description Logs in a user.
     * @param {ExpressResponse} response - The response object.
     * @param {ExpressRequest} request - The request object.
     * @param {LoginPayload} payload - The login payload.
     * @returns {Promise<{ accessToken: string}>} The access token.
     */
    public async login(response: ExpressResponse, request: ExpressRequest, payload: LoginPayload): Promise<{ accessToken: string } | string> {
        const user: UserDocument = await this.userService.findOne(payload.username);

        if (request.session.access_token) {
            return { accessToken: request.session.access_token };
        }

        if (user) {
            const accessToken = this.jwtService.sign({ username: user.username, id: user._id });

            request.session.access_token = accessToken;
            response.cookie("_user_username", user.username);
            response.cookie("_user_id", user._id);

            return { accessToken };
        } else {
            return "Invalid username or password.";
        }
    }

    /**
     * @description Logs out a user.
     * @param {ExpressResponse} response - The response object.
     * @param {ExpressRequest} request - The request object.
     * @returns {Promise<string>} Successful logout message.
     */
    public async logout(response: ExpressResponse, request: ExpressRequest): Promise<string> {
        request.session.destroy(() => {
            response.clearCookie("_user_username");
            response.clearCookie("_user_id");
        });
        return "Successfully logged out.";
    }

    /**
     * @description Validates a user's information.
     * @param {LoginPayload} payload - The user's information.
     * @returns {Promise<{ username: string; id: string }>}
     */
    public async validateUser(payload: LoginPayload): Promise<{ username: string; id: string }> {
        const user: UserDocument = await this.userService.findOne(payload.username);

        console.log(payload.username === user.username && (await bcrypt.compare(payload.password, user.password)));

        if (payload.username === user.username && (await bcrypt.compare(payload.password, user.password))) {
            return { username: user.username, id: user.id };
        }

        throw new UnauthorizedException({ statusCode: 401, message: "Invalid username or password." });
    }
}
