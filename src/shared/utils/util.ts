/**
 * administrare - web platform for internal data management
 * Copyright (C) 2022 imperatoria
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
 * @description Roman number conversion.
 * @param {Number} number - The number to convert.
 * @returns {Promise<String>} The roman number.
 */
export async function romanizeNumber(number: number): Promise<string> {
    let lookup: any = {
            M: 1000,
            CM: 900,
            D: 500,
            CD: 400,
            C: 100,
            XC: 90,
            L: 50,
            XL: 40,
            X: 10,
            IX: 9,
            V: 5,
            IV: 4,
            I: 1,
        },
        roman = "",
        i;
    for (i in lookup) {
        while (number >= lookup[i]) {
            roman += i;
            number -= lookup[i];
        }
    }
    return roman;
}

/**
 * @description Slugify a string.
 * @param {String} text - The string to slugify.
 * @returns {String} The slugified string.
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-");
}
