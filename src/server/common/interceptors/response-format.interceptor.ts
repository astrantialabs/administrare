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
 * @fileoverview The response format interceptor.
 * @author Rizky Irswanda <rizky.irswanda115@gmail.com>
 */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

export interface ResponseFormat<T> {
    success: boolean;
    statusCode: number;
    message: string;
    result: T;
}

@Injectable()
export class ResponseFormatInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat<T>> {
        return next.handle().pipe(
            tap((data) => context.switchToHttp().getResponse().status(data.statusCode)),
            map((data) => ({
                success: data.success,
                statusCode: data.statusCode,
                message: data.message,
                result: data.result,
            }))
        );
    }
}
