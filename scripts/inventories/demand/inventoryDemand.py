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
 # @fileoverview The InventoryDemand file.
 # @author Rizky Irswanda <rizky.irswanda115@gmail.com>
"""

from dependency import Dependency
from excel import Excel
from database import Database

class InventoryDemand():
    def main(currentDate):
        filePath = f"../{Dependency.inventoryDemandFolderPath}/{currentDate}.xlsx"

        Excel.create_file(filePath)
        workbook = Excel(filePath)
        workbook.change_sheet_name("Sheet", "Kategori")
        workbook.set_zoom(85)

        collection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryDemand)
        inventoryDemandDocument = collection.find_one({"tahun": 2022})
        
        InventoryDemand.writeCategoryHeader(workbook)

        workbook.create_sheet("Barang")
        workbook.change_sheet("Barang")
        workbook.set_zoom(85)

        InventoryDemand.writeItemHeader(workbook)

        workbook.save()


    def writeCategoryHeader(workbook):
        workbook.write_value_multiple("A1", "F1", ["No.", "Peminta", "Kategori", "Dibuat", "Direspon", "Status"])
        workbook.font_multiple("A1", "F1", size=12, bold=True)
        workbook.alignment_multiple("A1", "F1", vertical="center", horizontal="center")
        workbook.border_multiple("A1", "F1", "all", style="thin")

    
    def writeItemHeader(workbook):
        workbook.write_value_multiple("A1", "H1", ["No.", "Peminta", "Kategori", "Barang", "Satuan", "Dibuat", "Direspon", "Status"])
        workbook.font_multiple("A1", "H1", size=12, bold=True)
        workbook.alignment_multiple("A1", "H1", vertical="center", horizontal="center")
        workbook.border_multiple("A1", "H1", "all", style="thin")