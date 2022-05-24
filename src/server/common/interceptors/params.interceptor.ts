/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
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
