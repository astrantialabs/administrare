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
import { isDevelopmentEnvironment } from "./isDevelopmentEnvironment";

type FetchContext = {
    basePath: string;
};

const context: FetchContext = {
    basePath: "",
};

const initializeFetch = (basePath: string) => {
    context.basePath = basePath;
};

const getFetchUrl = (url: string, isPython: boolean) => {
    if (isServer) {
        if (isPython) {
            return url.startsWith("/") ? `${isDevelopmentEnvironment ? "http://0.0.0.0:3001" : "http://156.67.217.92:3001/"}${url}` : url;
        } else {
            return url.startsWith("/") ? `${isDevelopmentEnvironment ? "http://localhost:3000" : "https://inventory.setdisnakerbppn.com/"}${url}` : url;
        }
    }

    return url.startsWith("/") ? context.basePath + url : url;
};

const envAwareFetch = (url: string, options?: Partial<RequestInit>, text?: boolean, isPython?: boolean) => {
    const fetchUrl = getFetchUrl(url, isPython);

    if (text) {
        return fetch(fetchUrl, options).then((response) => response.text());
    }

    return fetch(fetchUrl, options).then((res) => res.json());
};

export { envAwareFetch as fetch, initializeFetch };
