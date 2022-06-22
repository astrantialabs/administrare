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

import { isDevelopmentEnvironment } from "../utils/isDevelopmentEnvironment";

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT || 3000;
export const BASE_DOMAIN = isDevelopmentEnvironment ? "http://localhost:3000/" : "https://inventory.setdisnakerbppn.com/";
export const PYTHON_BASE_DOMAIN = isDevelopmentEnvironment ? "http://0.0.0.0:3001/" : "http://156.67.217.92:3001/";

export const isServer = typeof window === "undefined";
export const isClient = !isServer;
