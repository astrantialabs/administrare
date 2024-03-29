/**
 * administrare - web platform for internal data management
 * Copyright (C) 2022 astrantialabs
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

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";

import { Provider as ReduxProvider } from "react-redux";
import NextApp, { AppProps } from "next/app";
import Head from "next/head";

import { AppDataContext } from "@/client/ssr/appData";
import { AppData } from "@/shared/typings/types/app-data";
import { initializeFetch } from "@/shared/utils/fetch";
import { store } from "@/client/redux/store";
import Footer from "@/components/Footer";

const theme = extendTheme({
    fonts: {
        body: "'Be Vietnam Pro', sans-serif",
        heading: "'Inter', sans-serif",
    },
});

class _app extends NextApp<AppProps> {
    public appData: AppData;

    constructor(props: AppProps) {
        super(props);

        this.appData = props.pageProps.appData || {};
        initializeFetch(this.appData.basePath);
    }

    render() {
        const { Component, pageProps } = this.props;
        const queryClient = new QueryClient();

        return (
            <>
                <Head>
                    <meta charSet="UTF-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                    <title>administrare</title>
                </Head>
                <AppDataContext.Provider value={this.appData}>
                    <ChakraProvider theme={theme}>
                        <QueryClientProvider client={queryClient}>
                            <ReduxProvider store={store}>
                                <Component {...pageProps} />
                                <Footer />
                            </ReduxProvider>
                        </QueryClientProvider>
                    </ChakraProvider>
                </AppDataContext.Provider>
            </>
        );
    }
}

export default _app;
