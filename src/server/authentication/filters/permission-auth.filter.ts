import { ExceptionFilter, Catch, ArgumentsHost, HttpException, ForbiddenException } from "@nestjs/common";
import { Response } from "express";
import { UnauthorizedException } from "@nestjs/common";

@Catch(ForbiddenException)
export class PermissionAuthFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        response.status(status).redirect("/");
    }
}
