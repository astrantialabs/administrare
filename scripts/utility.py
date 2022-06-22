"""
 # administrare - web platform for internal data management
 # Copyright (C) 2022 astrantialabs
 #
 # This program is free software: you can redistribute it and/or modify
 # it under the terms of the GNU General Public License as published by
 # the Free Software Foundation, either version 3 of the License, or
 # (at your option) any later version.
 #
 # This program is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU General Public License for more details.
 #
 # You should have received a copy of the GNU General Public License
 # along with this program.  If not, see <https://www.gnu.org/licenses/>.
"""

"""
 # @fileoverview The Utility file.
 # @author Rizky Irswanda <rizky.irswanda115@gmail.com>
"""

import datetime
import json

class Utility():
    def romanNumeral(number):
        respon = ""
        table = [
            (1000, "M"),
            (900, "CM"),
            (500, "D"),
            (400, "CD"),
            (100, "C"),
            (90, "XC"),
            (50, "L"),
            (40, "XL"),
            (10, "X"),
            (9, "IX"),
            (5, "V"),
            (4, "IV"),
            (1, "I"),
        ]
        for cap, roman in table:
            d, m = divmod(number, cap)
            respon += roman * d
            number = m

        return respon

    
    def currentDate():
        return datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S")


    def slugifyDate(rawDate):
        return rawDate.replace(" ", "-").replace(":", "-").replace(":", "-")     


    def convertStatus(rawStatus):
        status = None

        if(rawStatus == 0):
            status = "Belum direspon"

        elif(rawStatus == 1):
            status = "Diterima"

        elif(rawStatus == 2):
            status = "Ditolak"

        return status


    def readJSON(path):
        return json.load(open(path))

    
    def writeJSON(path, data):
        with open(path, "w") as outfile:
            outfile.write(json.dumps(data, indent = 4))

