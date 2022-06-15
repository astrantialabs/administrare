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

    const formated_current_date: string = `${current_date[2]}-${current_date[1]}-${current_date[0]}-${current_date[3]}-${current_date[4]}-${current_date[5]}`;

    return formated_current_date;
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
