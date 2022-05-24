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
 * @fileoverview The parameters interceptor.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

/**
 * @description The parameters interceptor.
 * @class ParamsInterceptor
 */
@Injectable()
export class ParamsInterceptor implements NestInterceptor {
    /**
     * @description Intercept the request.
     * @param {ExecutionContext} context - The execution context.
     * @param {CallHandler} next - The next call handler.
     * @returns {Observable<unknown>} - The observable.
     */
    public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
        const request = context.switchToHttp().getRequest() as Request;

        return next.handle().pipe(
            map((data) => {
                return {
                    ...request.query,
                    ...request.params,
                    ...data,
                };
            })
        );
    }
}
