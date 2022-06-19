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
 # @fileoverview The InventoryDemand file.
 # @author Rizky Irswanda <rizky.irswanda115@gmail.com>
"""

from dependency import Dependency
from excel import Excel
from database import Database
from utility import Utility

class InventoryDemand():
    def main(currentDate):
        filePath = f"../{Dependency.inventoryDemandFolderPath}/{currentDate}.xlsx"

        Excel.create_file(filePath)
        workbook = Excel(filePath)
        workbook.change_sheet_name("Sheet", "Kategori")
        workbook.set_zoom(85)

        collection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryDemand)
        inventoryDemandDocument = collection.find_one({"tahun": 2022})

        masterCollection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryMaster)
        inventoryMasterDocument = masterCollection.find_one({"tahun": 2022})
        
        InventoryDemand.writeCategoryHeader(workbook)
        InventoryDemand.writeCategoryMain(workbook, inventoryDemandDocument)

        workbook.create_sheet("Barang")
        workbook.change_sheet("Barang")
        workbook.set_zoom(85)

        InventoryDemand.writeItemHeader(workbook)
        InventoryDemand.writeItemMain(workbook, inventoryDemandDocument, inventoryMasterDocument)

        workbook.save()


    def writeCategoryHeader(workbook):
        workbook.write_value_multiple("A1", "F1", ["No.", "Peminta", "Kategori", "Dibuat", "Direspon", "Status"])
        workbook.font_multiple("A1", "F1", size=12, bold=True)
        workbook.alignment_multiple("A1", "F1", vertical="center", horizontal="center")
        workbook.border_multiple("A1", "F1", "all", style="thin")


    def writeCategoryMain(workbook, inventoryDemandDocument):
        rowCount = 2
        for categoryIndex, categoryObject in enumerate(inventoryDemandDocument.get("kategori")):
            status = Utility.convertStatus(categoryObject.get("status"))

            mainValue = [
                categoryIndex + 1,
                categoryObject.get("username"),
                categoryObject.get("kategori"),
                categoryObject.get("created_at"),
                categoryObject.get("responded_at"),
                status,
            ]

            workbook.write_value_multiple(["A", rowCount], ["F", rowCount], mainValue)
            workbook.alignment_multiple(["A", rowCount], ["F", rowCount], vertical="center", horizontal="center")
            workbook.alignment_multiple(["B", rowCount], ["E", rowCount], vertical="center", horizontal="left")
            workbook.border_multiple(["A", rowCount], ["F", rowCount], "all", style="thin")

            rowCount += 1

        
        workbook.adjust_width("A1", ["F", rowCount], extra_width=1)


    def writeItemHeader(workbook):
        workbook.write_value_multiple("A1", "H1", ["No.", "Peminta", "Kategori", "Barang", "Satuan", "Dibuat", "Direspon", "Status"])
        workbook.font_multiple("A1", "H1", size=12, bold=True)
        workbook.alignment_multiple("A1", "H1", vertical="center", horizontal="center")
        workbook.border_multiple("A1", "H1", "all", style="thin")


    def writeItemMain(workbook, inventoryDemandDocument, inventoryMasterDocument):
        rowCount = 2
        for demandItemIndex, demandItemObject in enumerate(inventoryDemandDocument.get("barang")):
            for masterCategoryObject in inventoryMasterDocument.get("kategori"):
                if(masterCategoryObject.get("id") == demandItemObject.get("kategori_id")):
                    print("test")
                    status = Utility.convertStatus(demandItemObject.get("status"))

                    mainValue = [
                        demandItemIndex + 1,
                        demandItemObject.get("username"),
                        masterCategoryObject.get("kategori"),
                        demandItemObject.get("barang"),
                        demandItemObject.get("satuan"),
                        demandItemObject.get("created_at"),
                        demandItemObject.get("responded_at"),
                        status
                    ]
    
                    workbook.write_value_multiple(["A", rowCount], ["H", rowCount], mainValue)
                    workbook.alignment_multiple(["A", rowCount], ["H", rowCount], vertical="center", horizontal="center")
                    workbook.alignment_multiple(["B", rowCount], ["D", rowCount], vertical="center", horizontal="left")
                    workbook.alignment_multiple(["F", rowCount], ["G", rowCount], vertical="center", horizontal="left")
                    workbook.border_multiple(["A", rowCount], ["H", rowCount], "all", style="thin")

                    rowCount += 1


        workbook.adjust_width("A1", ["H", rowCount], extra_width=1)