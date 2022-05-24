/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { GetServerSidePropsContext } from "src/shared/typings/types/next";
import { AppData } from "src/shared/typings/types/app-data";
import { filterUnserializable } from "./filterUnserializable";
import { StaticQuery } from "./buildServerSideProps";

const extractAppData = (ctx: GetServerSidePropsContext<Partial<StaticQuery>>) => {
    const { features, basePath } = ctx.query.config || {};

    return filterUnserializable({ features, basePath }) as Partial<AppData>;
};

export { extractAppData };
