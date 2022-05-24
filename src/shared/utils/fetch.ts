/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

import { isServer, PORT } from "../typings/constants";

type FetchContext = {
    basePath: string;
};

const context: FetchContext = {
    basePath: "",
};

const initializeFetch = (basePath: string) => {
    context.basePath = basePath;
};

const getFetchUrl = (url: string) => {
    if (isServer) {
        return url.startsWith("/") ? `http://localhost:${PORT}${url}` : url;
    }

    return url.startsWith("/") ? context.basePath + url : url;
};

const envAwareFetch = (url: string, options?: Partial<RequestInit>) => {
    const fetchUrl = getFetchUrl(url);

    return fetch(fetchUrl, options).then((res) => res.json());
};

export { envAwareFetch as fetch, initializeFetch };
