/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import NextApp, { AppProps } from "next/app";
import Head from "next/head";

import { AppDataContext } from "../client/ssr/appData";
import { AppData } from "../shared/typings/types/app-data";
import { initializeFetch } from "../shared/utils/fetch";

// import "../styles/index.scss";

class _app extends NextApp<AppProps> {
    public appData: AppData;

    constructor(props: AppProps) {
        super(props);

        this.appData = props.pageProps.appData || {};
        initializeFetch(this.appData.basePath);
    }

    render() {
        const { Component, pageProps } = this.props;

        return (
            <>
                <Head>
                    <meta charSet="UTF-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                    <title>Inventory Manager Subsystem</title>
                </Head>
                <AppDataContext.Provider value={this.appData}>
                    <Component {...pageProps} />
                </AppDataContext.Provider>
            </>
        );
    }
}

export default _app;
