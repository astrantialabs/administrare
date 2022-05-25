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

import { GetServerSidePropsContext } from "@/shared/typings/types/next";
import { AppData } from "@/shared/typings/types/app-data";

import { filterUnserializable } from "./filterUnserializable";
import { StaticQuery } from "./buildServerSideProps";

const extractAppData = (ctx: GetServerSidePropsContext<Partial<StaticQuery>>) => {
    const { features, basePath } = ctx.query.config || {};

    return filterUnserializable({ features, basePath }) as Partial<AppData>;
};

export { extractAppData };
