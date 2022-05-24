/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { GetServerSidePropsResult, GetServerSidePropsContext as GetServerSidePropsContextBase } from "next";
import { ParsedUrlQuery } from "querystring";

export type GetServerSidePropsContext<Q = ParsedUrlQuery> = Omit<GetServerSidePropsContextBase, "query"> & { query: Q };

export type GetServerSideProps<P, Q = ParsedUrlQuery> = (
    ctx: GetServerSidePropsContext<Q>
) => Promise<GetServerSidePropsResult<P>>;
