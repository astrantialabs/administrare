/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { ParsedUrlQuery } from "querystring";
import { AppData } from "src/shared/typings/types/app-data";
import { Config } from "src/shared/typings/types/config";
import { GetServerSideProps, GetServerSidePropsContext } from "src/shared/typings/types/next";
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
