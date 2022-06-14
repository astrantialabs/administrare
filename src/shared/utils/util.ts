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

import { ResponseFormat } from "@/server/common/interceptors/response-format.interceptor";

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

/**
 * @description Get current date
 * @returns {String} The current date
 */
export function currentDate(): string {
    const current_date: string[] = new Date()
        .toLocaleString("id-ID", { timeZone: "Asia/Hong_Kong" })
        .replace(/\//, " ")
        .replace(/\//, " ")
        .replace(/\./, " ")
        .replace(/\./, " ")
        .split(" ");

    const consistent_date: string[] = current_date.map((date) => {
        if (date.length < 2) {
            return "0".concat(date);
        } else if (date.length >= 2) {
            return date;
        }
    });

    const converted_date: string = `${consistent_date[2]}-${consistent_date[1]}-${consistent_date[0]} ${consistent_date[3]}:${consistent_date[4]}:${consistent_date[5]}`;

    return converted_date;
}

export function slugifyDate(raw_date: any) {
    const slugified_date = raw_date.replace(" ", "-").replace(":", "-").replace(":", "-");

    return slugified_date;
}

/**
 * @description calculate saldo_akhir_jumlah_satuan
 * @param {Number} saldo_jumlah_satuan - The saldo_jumlah_satuan data
 * @param {Number} mutasi_barang_masuk_jumlah_satuan - The mutasi_barang_masuk_jumlah_satuan data
 * @param {Number} mutasi_barang_keluar_jumlah_satuan - The mutasi_barang_keluar_jumlah_satuan data
 * @returns {Number} The calculated saldo_akhir_jumlah_satuan
 */
export function calculateSaldoAkhirJumlahSatuan(
    saldo_jumlah_satuan: number,
    mutasi_barang_masuk_jumlah_satuan: number,
    mutasi_barang_keluar_jumlah_satuan: number
): number {
    const saldo_akhir_jumlah_satuan: number = saldo_jumlah_satuan + mutasi_barang_masuk_jumlah_satuan - mutasi_barang_keluar_jumlah_satuan;

    return saldo_akhir_jumlah_satuan;
}

export function responseFormat<T>(success: boolean, statusCode: number, message: string, result: T): ResponseFormat<T> {
    return {
        success: success,
        statusCode: statusCode,
        message: message,
        result: result,
    };
}
