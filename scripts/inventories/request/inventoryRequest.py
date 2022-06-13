"""
 # administrare - web platform for internal data management
 # Copyright (C) 2022 imperatoria
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
 # @fileoverview The InventoryRequest file.
 # @author Rizky Irswanda <rizky.irswanda115@gmail.com>
"""

from dependency import Dependency
from excel import Excel
from database import Database
from utility import Utility

class InventoryRequest():
    folderPath = f"./{Dependency.mainFilePath}/{Dependency.inventoryFilePath}/{Dependency.inventoryRequestFilePath}"

    def main(currentDate):
        fileName = currentDate
        filePath = f"../{InventoryRequest.folderPath}/{fileName}.xlsx"

        Excel.create_file(filePath)
        workbook = Excel(filePath)
        workbook.set_zoom(85)

        collection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryRequest)
        inventoryRequestDocument = collection.find_one({"tahun": 2022})

        InventoryRequest.writeHeader(workbook)

        workbook.save()

    
    def writeHeader(workbook):
        workbook.write_value_multiple("A1", "I1", ["No.", "Peminta", "Kategori", "Barang", "Jumlah", "Satuan", "Keterangan", "Dibuat", "Direspon"])
        workbook.font_multiple("A1", "I1", size = 12, bold = True)
        workbook.alignment_multiple("A1", "I1", vertical = "center", horizontal = "center")
        workbook.border_multiple("A1", "I1", "all", style = "thin")

