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
        return url.startsWith("/") ? `https://localhost:${PORT}${url}` : url;
    }

    return url.startsWith("/") ? context.basePath + url : url;
};

const envAwareFetch = (url: string, options?: Partial<RequestInit>, text?: boolean) => {
    const fetchUrl = getFetchUrl(url);

    if (text) {
        return fetch(fetchUrl, options).then((response) => response.text());
    }

    return fetch(fetchUrl, options).then((res) => res.json());
};

export { envAwareFetch as fetch, initializeFetch };
