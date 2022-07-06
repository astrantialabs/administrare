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

import datetime
import os

from dependency import Dependency
from excel import Excel
from database import Database
from utility import Utility

class InventoryDemand():
    def writeRaw(currentDate):
        filePath = f"../{Dependency.inventoryDemandFolderPath}/Mentah {currentDate}.xlsx"

        Excel.create_file(filePath)
        workbook = Excel(filePath)
        workbook.change_sheet_name("Sheet", "Kategori")
        workbook.set_zoom(85)

        collection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryDemand)
        inventoryDemandDocument = collection.find_one({"tahun": 2022})

        masterCollection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryMaster)
        inventoryMasterDocument = masterCollection.find_one({"tahun": 2022})
        
        InventoryDemand.writeCategoryHeaderRaw(workbook)
        InventoryDemand.writeCategoryMainRaw(workbook, inventoryDemandDocument)

        workbook.create_sheet("Barang")
        workbook.change_sheet("Barang")
        workbook.set_zoom(85)

        InventoryDemand.writeItemHeaderRaw(workbook)
        InventoryDemand.writeItemMainRaw(workbook, inventoryDemandDocument, inventoryMasterDocument)

        workbook.save()


    def writeCategoryHeaderRaw(workbook):
        workbook.write_value_multiple("A1", "F1", ["No.", "Peminta", "Kategori", "Dibuat", "Direspon", "Status"])
        workbook.font_multiple("A1", "F1", size=12, bold=True)
        workbook.alignment_multiple("A1", "F1", vertical="center", horizontal="center")
        workbook.border_multiple("A1", "F1", "all", style="thin")


    def writeCategoryMainRaw(workbook, inventoryDemandDocument):
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


    def writeItemHeaderRaw(workbook):
        workbook.write_value_multiple("A1", "H1", ["No.", "Peminta", "Kategori", "Barang", "Satuan", "Dibuat", "Direspon", "Status"])
        workbook.font_multiple("A1", "H1", size=12, bold=True)
        workbook.alignment_multiple("A1", "H1", vertical="center", horizontal="center")
        workbook.border_multiple("A1", "H1", "all", style="thin")


    def writeItemMainRaw(workbook, inventoryDemandDocument, inventoryMasterDocument):
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

    
    def updateOptionData():
        files = os.listdir("../spreadsheets/inventories/demand")

        files.remove(".gitkeep")
        
        fileOptionArray = [["Mentah", [["Terbaru", True]]]]

        for file in files:
            fileNameArray = file.split(".")[0].split(" ")
            if(len(fileNameArray) > 1):
                fileDate = fileNameArray[-1].split("-")
                formattedFileDate = f"{fileDate[0]}-{fileDate[1]}-{fileDate[2]} {fileDate[3]}:{fileDate[4]}:{fileDate[5]}"

                dateIsValid = None
                try:
                    dateValidation = datetime.datetime(int(fileDate[0]), int(fileDate[1]), int(fileDate[2]), int(fileDate[3]), int(fileDate[4]), int(fileDate[5]))
                    dateIsValid = True

                except ValueError:
                    dateIsValid = False

                if(dateIsValid):
                    fileName = " ".join(fileNameArray[0:-1])

                    fileNameIsValid = True
                    for fileItem in fileOptionArray:
                        if(fileItem[0] == fileName):
                            fileNameIsValid = False

                    
                    if(fileNameIsValid):
                        fileOptionArray.append([fileName, [[formattedFileDate, False]]])

                    elif(not fileNameIsValid):
                        for fileItem in fileOptionArray:
                            if(fileItem[0] == fileName):

                                fileItemArrayIsValid = True
                                for fileItemArray in fileItem[1]:
                                    if(fileItemArray[0] == formattedFileDate):
                                        fileItemArrayIsValid = False
                                
                                if(fileItemArrayIsValid):
                                    fileItem[1].append([formattedFileDate, False])


        fileOptionData = []
        for fileItemIndex, fileItem in enumerate(fileOptionArray):
            fileDateData = []
            fileItem[1].sort(reverse=True, key=lambda item: item[0])
            for fileDateIndex, fileDate in enumerate(fileItem[1]):
                newFileDateObject = {
                    "id": fileDateIndex + 1,
                    "date": fileDate[0],
                    "creatable": fileDate[1]
                }

                fileDateData.append(newFileDateObject)

            
            newFileOptionObject = {
                "id": fileItemIndex + 1,
                "name": fileItem[0],
                "date": fileDateData
            }

            fileOptionData.append(newFileOptionObject)

        
        Utility.writeJSON("./json/demand_option_data.json", fileOptionData)
