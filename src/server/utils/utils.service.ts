/**
 * Copyright (C) imperatoria - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */

/**
 * @fileoverview The utils service.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { Injectable } from "@nestjs/common";

/**
 * @class UtilsService
 * @description Utils service.
 */
@Injectable()
export class UtilsService {
    /**
     * @constructor
     * @description Creates a new utils service.
     */
    constructor() {}

    /**
     * @description Romanize a number.
     * @param {Number} number - The number to romanize.
     * @returns {Promise<string>} The romanized number.
     */
    public async romanizeNumber(number: number): Promise<string> {
        if (isNaN(number)) {
            return "NaN";
        }

        let digits: string[] = String(+number).split(""),
            key = [
                "",
                "C",
                "CC",
                "CCC",
                "CD",
                "D",
                "DC",
                "DCC",
                "DCCC",
                "CM",
                "",
                "X",
                "XX",
                "XXX",
                "XL",
                "L",
                "LX",
                "LXX",
                "LXXX",
                "XC",
                "",
                "I",
                "II",
                "III",
                "IV",
                "V",
                "VI",
                "VII",
                "VIII",
                "IX",
            ],
            roman = "",
            i = 3;
        while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
        return Array(+digits.join("") + 1).join("M") + roman;
    }

    /**
     * @description Romanize a numbers
     * @param {Number[]} numbers - The numbers to romanize.
     * @returns {Promise<string[]>} The romanized numbers.]}
     */
    public async romanizeNumbers(numbers: number[]): Promise<string[]> {
        return await Promise.all(
            numbers.map(async (number) => {
                return await this.romanizeNumber(number);
            })
        );
    }

    /**
     * @description Check if a string is a roman number
     * @param {String} roman - The string to check
     * @returns {Boolean} - True if the string is a roman number
     */
    public isRomanNumber(roman: string): boolean {
        return /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(roman);
    }

    /**
     * @description Check if a number is null
     * @param {Number} number - The number to check
     * @returns {Number} - The number if not null, 0 if null
     */
    public isNull(number: number): number {
        if (number === null) {
            return 0;
        }
        return number;
    }

    /**
     * @description Multiply a number.
     * @param {Number} a - The first number.
     * @param {Number} b - The second number.
     * @returns {Number} The result of the multiplication.
     */
    public multiply(a: number, b: number): string {
        a = this.isNull(a);
        b = this.isNull(b);

        let result = a * b;
        return result.toString();
    }
}
