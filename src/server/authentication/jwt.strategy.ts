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

import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

import { ExtractJwt, Strategy } from "passport-jwt";
import { Request as ExpressRequest } from "express";

import { ConfigService } from "../config/config.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT, ExtractJwt.fromAuthHeaderAsBearerToken()]),
            ignoreExpiration: false,
            secretOrKey: configService.authentication.jwt_secret,
        });
    }

    private static extractJWT(request: ExpressRequest): string | null {
        const jwt = request.session.access_token;
        if (jwt) {
            return jwt;
        }
        return null;
    }

    public async validate({ username, id }: { username: string; id: string }): Promise<{ username: string; id: string }> {
        return { username, id };
    }
}
