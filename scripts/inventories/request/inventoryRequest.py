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
 # @fileoverview The InventoryRequest file.
 # @author Rizky Irswanda <rizky.irswanda115@gmail.com>
"""

from dependency import Dependency
from excel import Excel
from database import Database
from utility import Utility

class InventoryRequest():
    def main(currentDate):
        filePath = f"../{Dependency.inventoryRequestFolderPath}/raw {currentDate}.xlsx"

        Excel.create_file(filePath)
        workbook = Excel(filePath)
        workbook.change_sheet_name("Sheet", "Seluruh")
        workbook.set_zoom(85)

        requestCollection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryRequest)
        inventoryRequestDocument = requestCollection.find_one({"tahun": 2022})

        masterCollection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryMaster)
        inventoryMasterDocument = masterCollection.find_one({"tahun": 2022})

        userData = InventoryRequest.getUserData(inventoryRequestDocument)
        Utility.writeJSON("./json/request.json", userData)  

        InventoryRequest.writeHeaderNormal(workbook)
        InventoryRequest.writeMainNormal(workbook, inventoryRequestDocument, inventoryMasterDocument)

        for userObject in userData:
            workbook.create_sheet(userObject.get("username"))
            workbook.change_sheet(userObject.get("username"))
            workbook.set_zoom(85)

            requestData = { "barang": [] }

            for dateObject in userObject.get("date"):
                for requestObject in dateObject.get("request"):
                    requestData.get("barang").append(requestObject)


            InventoryRequest.writeHeaderNormal(workbook)
            InventoryRequest.writeMainNormal(workbook, requestData, inventoryMasterDocument)

            for dateObject in userObject.get("date"):
                dateName = f'{userObject.get("username")} {"".join(dateObject.get("date").split("-"))}'
                workbook.create_sheet(dateName)
                workbook.change_sheet(dateName)
                workbook.set_zoom(85)

                InventoryRequest.writeHeaderNormal(workbook)
                InventoryRequest.writeMainNormal(workbook, { "barang": dateObject.get("request") }, inventoryMasterDocument)
                    

        workbook.save()


    def writeHeaderNormal(workbook):
        workbook.write_value_multiple("A1", "J1", ["No.", "Peminta", "Kategori", "Barang", "Jumlah", "Satuan", "Keterangan", "Dibuat", "Direspon", "Status"])
        workbook.font_multiple("A1", "J1", size = 12, bold = True)
        workbook.alignment_multiple("A1", "J1", vertical = "center", horizontal = "center")
        workbook.border_multiple("A1", "J1", "all", style = "thin")

    
    def writeMainNormal(workbook, requestData, masterData):
        rowCount = 2
        for requestItemIndex, requestItemObject in enumerate(requestData.get("barang")):
            for masterCategoryObject in masterData.get("kategori"):
                if(requestItemObject.get("kategori_id") == masterCategoryObject.get("id")):
                    for masterItemObject in masterCategoryObject.get("barang"):
                        if(requestItemObject.get("barang_id") == masterItemObject.get("id")):
                            status = Utility.convertStatus(requestItemObject.get("status"))

                            mainValue = [
                                requestItemIndex + 1,
                                requestItemObject.get("username"),
                                masterCategoryObject.get("kategori"),
                                masterItemObject.get("nama"),
                                requestItemObject.get("total"),
                                masterItemObject.get("satuan"),
                                requestItemObject.get("deskripsi"),
                                requestItemObject.get("created_at"),
                                requestItemObject.get("responded_at"),
                                status
                            ]
            
                            workbook.write_value_multiple(["A", rowCount], ["J", rowCount], mainValue)
                            workbook.border_multiple(["A", rowCount], ["J", rowCount], "all", style="thin")
                            workbook.alignment_multiple(["A", rowCount], ["J", rowCount], vertical="center", horizontal="center")

                            workbook.alignment_multiple(["B", rowCount], ["D", rowCount], vertical="center", horizontal="left")
                            workbook.alignment_multiple(["G", rowCount], ["I", rowCount], vertical="center", horizontal="left")

                            rowCount += 1


        workbook.adjust_width("A1", ["J", rowCount], extra_width=2)


    def getUserData(inventoryRequestDocument):
        usernameArray = []
        for requestMain in inventoryRequestDocument.get("barang"):
            if(requestMain.get("username") not in usernameArray):
                usernameArray.append(requestMain.get("username"))


        userData = []
        for usernameIndex, usernameItem in enumerate(usernameArray):
            newUserObject = {
                "id": usernameIndex + 1,
                "username": usernameItem,
                "date": []
            }

            userData.append(newUserObject)


        for userObject in userData:
            dateArray = []
            for requestMain in inventoryRequestDocument.get("barang"):
                createdAt = (requestMain.get("created_at").split(" "))[0]
                
                if(createdAt not in dateArray):
                    dateArray.append(createdAt)


            for dateIndex, dateItem in enumerate(dateArray):
                newDateObject = {
                    "id": dateIndex + 1,
                    "date": dateItem,
                    "request": []
                }

                userObject.get("date").append(newDateObject)

        
        for requestMain in inventoryRequestDocument.get("barang"):
            for userObject in userData:
                if(requestMain.get("username") == userObject.get("username")):
                    for dateObject in userObject.get("date"):
                        if((requestMain.get("created_at").split(" "))[0]) == dateObject.get("date"):
                            newRequestObject = requestMain
                            newRequestObject["internal_id"] = len(dateObject.get("request")) + 1

                            dateObject.get("request").append(newRequestObject)


        return userData
