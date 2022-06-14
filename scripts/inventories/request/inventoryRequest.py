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
    def main(currentDate):
        filePath = f"../{Dependency.inventoryRequestFolderPath}/{currentDate}.xlsx"

        Excel.create_file(filePath)
        workbook = Excel(filePath)
        workbook.set_zoom(85)

        requestCollection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryRequest)
        inventoryRequestDocument = requestCollection.find_one({"tahun": 2022})

        masterCollection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryMaster)
        inventoryMasterDocument = masterCollection.find_one({"tahun": 2022})

        InventoryRequest.writeHeader(workbook)
        InventoryRequest.writeMain(workbook, inventoryRequestDocument, inventoryMasterDocument)

        workbook.save()

    
    def writeHeader(workbook):
        workbook.write_value_multiple("A1", "J1", ["No.", "Peminta", "Kategori", "Barang", "Jumlah", "Satuan", "Keterangan", "Dibuat", "Direspon", "Status"])
        workbook.font_multiple("A1", "J1", size = 12, bold = True)
        workbook.alignment_multiple("A1", "J1", vertical = "center", horizontal = "center")
        workbook.border_multiple("A1", "J1", "all", style = "thin")

    
    def writeMain(workbook, inventoryRequestDocument, inventoryMasterDocument):
        rowCount = 2
        for requestItemIndex, requestItemObject in enumerate(inventoryRequestDocument.get("barang")):
            for masterCategoryObject in inventoryMasterDocument.get("kategori"):
                if(requestItemObject.get("kategori_id") == masterCategoryObject.get("id")):
                    for masterItemObject in masterCategoryObject.get("barang"):
                        if(requestItemObject.get("barang_id") == masterItemObject.get("id")):
                            createdAt = Utility.convertDateYYYYMMDDHHMMSS(requestItemObject.get("created_at"))
                            respondedAt = Utility.convertDateYYYYMMDDHHMMSS(requestItemObject.get("responded_at"))
                            status = Utility.convertStatus(requestItemObject.get("status"))

                            mainValue = [
                                requestItemIndex + 1,
                                requestItemObject.get("username"),
                                masterCategoryObject.get("kategori"),
                                masterItemObject.get("nama"),
                                requestItemObject.get("total"),
                                masterItemObject.get("satuan"),
                                requestItemObject.get("deskripsi"),
                                createdAt,
                                respondedAt,
                                status
                            ]
            
                            workbook.write_value_multiple(["A", rowCount], ["J", rowCount], mainValue)
                            workbook.border_multiple(["A", rowCount], ["J", rowCount], "all", style="thin")
                            workbook.alignment_multiple(["A", rowCount], ["J", rowCount], vertical="center", horizontal="center")

                            workbook.alignment_multiple(["B", rowCount], ["D", rowCount], vertical="center", horizontal="left")
                            workbook.alignment_multiple(["G", rowCount], ["I", rowCount], vertical="center", horizontal="left")

                            rowCount += 1


        workbook.adjust_width("A1", ["J", rowCount], extra_width=1)