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

/**
 * @fileoverview The inventory type interface.
 * @author Rizky Irswanda <rizky.irswanda115@gmail.com>
 */

/**
 * @interface ResponseObject
 * @description The response object type interface.
 */
export interface ResponseObject<T> {
    [key: string]: T;
}

export interface DownloadOptionDataDate {
    id: number;
    date: string;
};

export interface DownloadOptionData {
    id: number;
    name: string;
    date: DownloadOptionDataDate[];
};