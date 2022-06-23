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

import os
import datetime

from docx import Document
from docx.shared import Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH

from dependency import Dependency
from excel import Excel
from database import Database
from utility import Utility


class InventoryRequest():
    def writeRaw(currentDate):
        filePath = f"../{Dependency.inventoryRequestFolderPath}/Mentah {currentDate}.xlsx"

        Excel.create_file(filePath)
        workbook = Excel(filePath)
        workbook.change_sheet_name("Sheet", "Seluruh")
        workbook.set_zoom(85)

        requestCollection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryRequest)
        inventoryRequestDocument = requestCollection.find_one({"tahun": 2022})

        masterCollection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryMaster)
        inventoryMasterDocument = masterCollection.find_one({"tahun": 2022})

        userData = Utility.readJSON("./json/user_data.json")

        InventoryRequest.writeHeaderRaw(workbook)
        InventoryRequest.writeMainRaw(workbook, inventoryRequestDocument, inventoryMasterDocument)

        for userObject in userData:
            workbook.create_sheet(userObject.get("username"))
            workbook.change_sheet(userObject.get("username"))
            workbook.set_zoom(85)

            requestData = { "barang": [] }

            for dateObject in userObject.get("date"):
                for requestObject in dateObject.get("request"):
                    requestData.get("barang").append(requestObject)


            InventoryRequest.writeHeaderRaw(workbook)
            InventoryRequest.writeMainRaw(workbook, requestData, inventoryMasterDocument)

            for dateObject in userObject.get("date"):
                dateName = f'{userObject.get("username")} {"".join(dateObject.get("date").split("-"))}'
                workbook.create_sheet(dateName)
                workbook.change_sheet(dateName)
                workbook.set_zoom(85)

                InventoryRequest.writeHeaderRaw(workbook)
                InventoryRequest.writeMainRaw(workbook, { "barang": dateObject.get("request") }, inventoryMasterDocument)
                    

        workbook.save()


    def writeHeaderRaw(workbook):
        workbook.write_value_multiple("A1", "J1", ["No.", "Peminta", "Kategori", "Barang", "Jumlah", "Satuan", "Keterangan", "Dibuat", "Direspon", "Status"])
        workbook.font_multiple("A1", "J1", size = 12, bold = True)
        workbook.alignment_multiple("A1", "J1", vertical = "center", horizontal = "center")
        workbook.border_multiple("A1", "J1", "all", style = "thin")

    
    def writeMainRaw(workbook, requestData, masterData):
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


    def writeUser(userId, dateId):
        masterCollection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryMaster)
        inventoryMasterDocument = masterCollection.find_one({"tahun": 2022})

        optionData = Utility.readJSON("./json/option_data.json")
        userData = Utility.readJSON("./json/user_data.json")

        for userObject in optionData:
            if(userObject.get("id") == userId):
                usernameValue = userObject.get("name")

                for dateObject in userObject.get("date"):
                    if(dateObject.get("id") == dateId):
                        dateValue = dateObject.get("date")

        
        splittedDate = Utility.slugifyDate(dateValue).split("-")

        fileTemplate = "./media/User Request Template.docx"
        filePath = f"../{Dependency.inventoryRequestFolderPath}/{usernameValue} {Utility.slugifyDate(dateValue)}.docx"

        document = Document(fileTemplate)

        for paragraph in document.paragraphs:
            if("Balikpapan" in paragraph.text):
                paragraph.add_run(f" {splittedDate[2]} {Utility.translateMonthName(Utility.convertNumberToMonthName(splittedDate[1]))} {splittedDate[1]}")

        
        document.paragraphs[len(document.paragraphs) - 2].add_run(f"{' ' * 90} {usernameValue}")

        for userObject in userData:
            if(userObject.get("username") == usernameValue):
                for dateObject in userObject.get("date"):
                    if(dateObject.get("date") == dateValue.split(" ")[0]):
                        
                        rowCount = 1
                        for requestIndex, requestObject in enumerate(dateObject.get("request")):
                            for categoryObject in inventoryMasterDocument.get("kategori"):
                                if(categoryObject.get("id") == requestObject.get("kategori_id")):
                                    for itemObject in categoryObject.get("barang"):
                                        if(itemObject.get("id") == requestObject.get("barang_id")):
                                            itemName = itemObject.get("nama")
                                            itemUnit = itemObject.get("satuan")


                            row = document.tables[0].rows[rowCount]

                            value = [
                                requestIndex + 1,
                                itemName,
                                requestObject.get("total"),
                                itemUnit,
                                requestObject.get("deskripsi")
                            ]

                            for i in range(len(value)):
                                row.cells[i].text = str(value[i])
      
                                for paragraph in row.cells[i].paragraphs:
                                    for run in paragraph.runs:
                                        run.font.size = Pt(10)
                            
                            
                            cellCenterList = [0, 2, 3]
                            for cell in cellCenterList:
                                for paragraph in row.cells[cell].paragraphs:
                                    paragraph.alignment= WD_ALIGN_PARAGRAPH.CENTER


                            rowCount += 1


        document.save(filePath)


    def updateUserData():
        requestCollection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryRequest)
        inventoryRequestDocument = requestCollection.find_one({"tahun": 2022})

        usernameArray = []
        for requestMain in inventoryRequestDocument.get("barang"):
            if(requestMain.get("status") == 1):
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
                if(requestMain.get("status") == 1):
                    if(requestMain.get("username") == userObject.get("username")):
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
            if(requestMain.get("status") == 1):
                for userObject in userData:
                    if(requestMain.get("username") == userObject.get("username")):
                        for dateObject in userObject.get("date"):
                            if((requestMain.get("created_at").split(" "))[0]) == dateObject.get("date"):
                                newRequestObject = requestMain
                                newRequestObject["internal_id"] = len(dateObject.get("request")) + 1

                                dateObject.get("request").append(newRequestObject)


        Utility.writeJSON("./json/user_data.json", userData) 


    def updateOptionData():
        files = os.listdir("../spreadsheets/inventories/request")

        files.remove(".gitkeep")
        
        file_option_array = [["Mentah", [["Terbaru", True]]]]

        json_user_requst_data = Utility.readJSON("./json/user_data.json")
        for user_object in json_user_requst_data:
            
            date_array = []
            for date_object in user_object.get("date"):
                date_array.append([f"{date_object.get('date')} 00:00:00", True])

            
            file_option_array.append([user_object.get("username"), date_array])
        

        for file in files:
            file_name_array = file.split(".")[0].split(" ")
            if(len(file_name_array) > 1):
                file_date = file_name_array[-1].split("-")
                formatted_file_date = f"{file_date[0]}-{file_date[1]}-{file_date[2]} {file_date[3]}:{file_date[4]}:{file_date[5]}"

                date_is_valid = None
                try:
                    date_validation = datetime.datetime(int(file_date[0]), int(file_date[1]), int(file_date[2]), int(file_date[3]), int(file_date[4]), int(file_date[5]))
                    date_is_valid = True

                except ValueError:
                    date_is_valid = False

                if(date_is_valid):
                    file_name = " ".join(file_name_array[0:-1])

                    file_name_is_valid = True
                    for file_item in file_option_array:
                        if(file_item[0] == file_name):
                            file_name_is_valid = False

                    
                    if(file_name_is_valid):
                        file_option_array.append([file_name, [[formatted_file_date, False]]])

                    elif(not file_name_is_valid):
                        for file_item in file_option_array:
                            if(file_item[0] == file_name):

                                file_item_array_is_valid = True
                                for file_item_array in file_item[1]:
                                    if(file_item_array[0] == formatted_file_date):
                                        file_item_array_is_valid = False
                                
                                if(file_item_array_is_valid):
                                    file_item[1].append([formatted_file_date, False])


        file_option_data = []
        for file_item_index, file_item in enumerate(file_option_array):
            file_date_data = []
            for file_date_index, file_date in enumerate(file_item[1]):
                new_file_date_object = {
                    "id": file_date_index + 1,
                    "date": file_date[0],
                    "creatable": file_date[1]
                }

                file_date_data.append(new_file_date_object)

            
            new_file_option_object = {
                "id": file_item_index + 1,
                "name": file_item[0],
                "date": file_date_data
            }

            file_option_data.append(new_file_option_object)

        
        Utility.writeJSON("./json/option_data.json", file_option_data)
