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

import { ParsedUrlQuery } from "querystring";

import { AppData } from "@/shared/typings/types/app-data";
import { Config } from "@/shared/typings/types/config";
import { GetServerSideProps, GetServerSidePropsContext } from "@/shared/typings/types/next";

import { extractAppData } from "./extractAppData";

type StaticProps = {
    appData: Partial<AppData>;
};

export type StaticQuery = {
    config: Config;
};

const buildServerSideProps = <P, Q extends ParsedUrlQuery = ParsedUrlQuery>(
    getServerSideProps: (ctx: GetServerSidePropsContext<Q>) => Promise<P>
): GetServerSideProps<StaticProps & P, Partial<StaticQuery> & Q> => {
    return async (ctx) => {
        const props = await getServerSideProps(ctx);

        return {
            props: {
                ...props,
                appData: extractAppData(ctx),
            },
        };
    };
};

export { buildServerSideProps };
