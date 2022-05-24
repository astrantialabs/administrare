/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
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
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
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

    public async validate({
        username,
        id,
    }: {
        username: string;
        id: string;
    }): Promise<{ username: string; id: string }> {
        return { username, id };
    }
}
