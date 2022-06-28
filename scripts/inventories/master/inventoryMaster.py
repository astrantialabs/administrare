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
 # @fileoverview The InventoryMaster file.
 # @author Rizky Irswanda <rizky.irswanda115@gmail.com>
"""

import datetime
import os

from openpyxl.drawing.image import Image as ExcelImage
from PIL import Image, ImageDraw, ImageFont

from dependency import Dependency
from excel import Excel
from database import Database
from utility import Utility

class Pillow():
    def __init__(self, filePath, size = None):
        self.filePath = filePath

        if(size == None):
            self.image = Image.open(self.filePath)

            self.size = self.image.size
            self.width = self.size[0]
            self.height = self.size[1]


        elif(size != None):
            self.size = size
            self.width = self.size[0]
            self.height = self.size[1]
            
            self.image = Image.new("RGB", self.size, "white")


        self.draw = ImageDraw.Draw(self.image)


    def resize(self, size):
        self.image = self.image.resize(size)


    def save(self):
        self.image.save(self.filePath)


    def checkTextSize(self, text, font):
        return self.draw.textsize(text, font=font)


    def drawText(self, position, text, font, fill):
        self.draw.text(position, text, fill=fill, font=font)


    def drawLine(self, position, fill, width):
        self.draw.line(position, fill=fill, width=width)
    

class InventoryMaster():
    def writeRaw(currentDate):
        filePath = f"../{Dependency.inventoryMasterFolderPath}/Mentah {currentDate}.xlsx"

        collection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryMaster)
        inventoryMasterDocument = collection.find_one({"tahun": 2022})

        Excel.create_file(filePath)
        workbook = Excel(filePath)
        workbook.change_sheet_name("Sheet", "Inventarisasi")
        workbook.set_zoom(85)

        InventoryMaster.writeHeaderRaw(workbook)
        InventoryMaster.writeMainRaw(workbook, inventoryMasterDocument)

        workbook.save()


    def writeHeaderRaw(workbook):
        headerValue = [
            "No.",
            "Nama",
            "Satuan",
            "Harga Satuan",
            "Saldo Jumlah Satuan",
            "Mutasi Barang Masuk Jumlah Satuan",
            "Mutasi Barang Keluar Jumlah Satuan",
            "Saldo Akhir Jumlah Satuan",
            "Jumlah Permintaan",
            "Dibuat",
            "Diupdate",
            "Keterangan",
            "Aktif"
        ]

        workbook.write_value_multiple("A1", "M1", headerValue)
        workbook.font_multiple("A1", "M1", bold = True, size = 12)
        workbook.alignment_multiple("A1", "M1", horizontal = "center", vertical = "center")
        workbook.border_multiple("A1", "M1", "all", style="thin")


    def writeMainRaw(workbook, inventoryMasterDocument):
        rowCount = 2

        categoryCount = 1
        for categoryObject in inventoryMasterDocument.get("kategori"):
            workbook.write_value_multiple(["A", rowCount], ["B", rowCount], [Utility.romanNumeral(categoryCount), categoryObject.get("kategori")])
            workbook.write_value_multiple(["J", rowCount], ["K", rowCount], [categoryObject.get("created_at"), categoryObject.get("updated_at")])
            workbook.write_value_singular(["M", rowCount], Utility.convertActive(categoryObject.get("active")))


            workbook.font_multiple(["A", rowCount], ["M", rowCount], bold = True)
            workbook.alignment_singular(["A", rowCount], horizontal = "center", vertical = "center")
            workbook.border_multiple(["A", rowCount], ["M", rowCount], "all", style="thin")

            rowCount += 1

            itemCount = 1
            for itemObject in categoryObject.get("barang"):
                itemValue = [
                    itemCount,
                    itemObject.get("nama"),
                    itemObject.get("satuan"),
                    itemObject.get("harga_satuan"),
                    itemObject.get("saldo_jumlah_satuan"),
                    itemObject.get("mutasi_barang_masuk_jumlah_satuan"),
                    itemObject.get("mutasi_barang_keluar_jumlah_satuan"),
                    itemObject.get("saldo_akhir_jumlah_satuan"),
                    itemObject.get("jumlah_permintaan"),
                    itemObject.get("created_at"),
                    itemObject.get("updated_at"),
                    itemObject.get("keterangan"),
                    Utility.convertActive(itemObject.get("active"))
                ]

                workbook.write_value_multiple(["A", rowCount], ["M", rowCount], itemValue)

                workbook.font_multiple(["A", rowCount], ["M", rowCount], size = 10)
                workbook.alignment_singular(["A", rowCount], horizontal = "center", vertical="center")
                workbook.alignment_multiple(["C", rowCount], ["I", rowCount], horizontal = "center", vertical="center")
                workbook.border_multiple(["A", rowCount], ["M", rowCount], "all", style="thin")

                rowCount += 1
                itemCount += 1


            workbook.border_multiple(["A", rowCount], ["M", rowCount], "all", style="thin")
            rowCount += 1
            categoryCount += 1


        workbook.adjust_width("A1", ["C", rowCount], extra_width = 1, width_limit = 40)
        workbook.alignment_singular("B1", horizontal = "center", vertical = "center")

        workbook.adjust_width("D1", ["I", rowCount], extra_width = 1, width_limit = 15)
        workbook.alignment_multiple("D1", ["I", rowCount], horizontal = "center", vertical = "center", wrap = True)

        workbook.adjust_width("J1", ["M", rowCount], extra_width = 1)
        workbook.alignment_multiple("M1", ["M", rowCount], horizontal = "center", vertical = "center")


    def writeFormat(currentDate):
        filePath = f"../{Dependency.inventoryMasterFolderPath}/Format {currentDate}.xlsx"

        collection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryMaster)
        inventoryMasterDocument = collection.find_one({"tahun": 2022})

        dependencyData = InventoryMaster.getTranslatedDependencyData()

        Excel.create_file(filePath)
        workbook = Excel(filePath)
        workbook.change_sheet_name("Sheet", f"Semester {dependencyData['semester']}")
        workbook.set_zoom(85)

        InventoryMaster.writeHeaderFormat(workbook, dependencyData)
        InventoryMaster.writeMainFormat(workbook, inventoryMasterDocument, dependencyData)

        workbook.save()


    def writeHeaderFormat(workbook, dependencyData):
        workbook.write_value_multiple("A1", "A3", [f"LAPORAN INVENTARISASI PERSEDIAAN SEMESTER {dependencyData['semester']} TAHUN {dependencyData['tahun_akhir']}", f"PER {dependencyData['tanggal_akhir']} {(dependencyData['bulan_akhir']).upper()} {dependencyData['tahun_akhir']}", "DINAS KETENAGAKERJAAN KOTA BALIKPAPAN"])
        workbook.write_value_multiple("A4", "C4", ["No", "Uraian Barang", "Satuan"])

        workbook.write_value_singular("D4", f"Saldo (Per {dependencyData['tanggal_awal']} {dependencyData['bulan_awal']} {dependencyData['tahun_awal']})")
        workbook.write_value_singular("G4", "Mutasi Barang Masuk")
        workbook.write_value_singular("J4", "Mutasi Barang Keluar")
        workbook.write_value_singular("M4", f"Saldo Akhir (Per {dependencyData['tanggal_akhir']} {dependencyData['bulan_akhir']} {dependencyData['tahun_akhir']})")

        d5O5Value = ["Jumlah Satuan", "Harga Satuan (Rp)", "Jumlah (Rp)"]
        workbook.write_value_multiple("D5", "F5", d5O5Value)
        workbook.write_value_multiple("G5", "I5", d5O5Value)
        workbook.write_value_multiple("J5", "L5", d5O5Value)
        workbook.write_value_multiple("M5", "O5", d5O5Value)

        workbook.merge("A1", "O1")
        workbook.merge("A2", "O2")

        workbook.merge("A4", "A5")
        workbook.merge("B4", "B5")
        workbook.merge("C4", "C5")

        workbook.merge("D4", "F4")
        workbook.merge("G4", "I4")
        workbook.merge("J4", "L4")
        workbook.merge("M4", "O4")

        workbook.font_singular("A1", bold = True, size = 12)
        workbook.alignment_singular("A1", vertical = "top", horizontal = "center")

        workbook.alignment_singular("A2", vertical = "top", horizontal = "center")

        workbook.alignment_singular("A3", vertical = "top", horizontal = "left")

        workbook.font_multiple("A4", "O5", bold = True, size = 10)
        workbook.alignment_multiple("A4", "O5", vertical = "center", horizontal = "center")
        workbook.border_multiple("A4", "O5", "all", style = "thin")


    def writeMainFormat(workbook, inventoryMasterDocument, dependencyData): 
        rowCount = 6

        footerString = "Total"

        saldoJumlahTotal = 0
        mutasiBarangMasukJumlahTotal = 0
        mutasiBarangKeluarJumlahTotal = 0
        saldoAkhirJumlahTotal = 0
        categoryCount = 1
        for categoryObject in inventoryMasterDocument.get("kategori"):
            if(categoryObject.get("active")):
                romanNumeral = Utility.romanNumeral(categoryCount)
                workbook.write_value_singular(["A", rowCount], f"{romanNumeral}.")
                workbook.write_value_singular(["B", rowCount], categoryObject.get("kategori"))

                workbook.font_multiple(["A", rowCount], ["B", rowCount], bold = True, size = 10)
                workbook.alignment_singular(["A", rowCount], vertical = "top", horizontal = "center")
                workbook.alignment_singular(["B", rowCount], vertical = "top", horizontal = "left")
                workbook.border_multiple(["A", rowCount], ["O", rowCount], "all", style = "thin")

                rowCount += 1
                categoryCount += 1

                saldoJumlahSubTotal = 0
                mutasiBarangMasukJumlahSubTotal = 0
                mutasiBarangKeluarJumlahSubTotal = 0
                saldoAkhirJumlahSubTotal = 0
                itemCount = 1
                for itemObject in categoryObject.get("barang"):
                    if(itemObject.get("active")):
                        hargaSatuan = itemObject.get("harga_satuan")

                        saldoJumlahSatuan = itemObject.get("saldo_jumlah_satuan")
                        saldoJumlah = saldoJumlahSatuan * hargaSatuan
                        saldoJumlahSubTotal += saldoJumlah

                        mutasiBarangMasukJumlahSatuan = itemObject.get("mutasi_barang_masuk_jumlah_satuan")
                        mutasiBarangMasukJumlah = mutasiBarangMasukJumlahSatuan * hargaSatuan
                        mutasiBarangMasukJumlahSubTotal += mutasiBarangMasukJumlah

                        mutasiBarangKeluarJumlahSatuan = itemObject.get("mutasi_barang_keluar_jumlah_satuan")
                        mutasiBarangKeluarJumlah = mutasiBarangKeluarJumlahSatuan * hargaSatuan
                        mutasiBarangKeluarJumlahSubTotal += mutasiBarangKeluarJumlah

                        saldoAkhirJumlahSatuan = itemObject.get("saldo_akhir_jumlah_satuan")
                        saldoAkhirJumlah = saldoAkhirJumlahSatuan * hargaSatuan
                        saldoAkhirJumlahSubTotal += saldoAkhirJumlah

                        workbook.write_value_singular(["A", rowCount], itemCount)
                        workbook.write_value_singular(["B", rowCount], itemObject.get("nama"))
                        workbook.write_value_singular(["C", rowCount], itemObject.get("satuan"))

                        workbook.write_value_singular(["D", rowCount], saldoJumlahSatuan)
                        workbook.write_value_singular(["E", rowCount], hargaSatuan)
                        workbook.write_value_singular(["F", rowCount], saldoJumlah)

                        workbook.write_value_singular(["G", rowCount], mutasiBarangMasukJumlahSatuan)
                        workbook.write_value_singular(["H", rowCount], hargaSatuan)
                        workbook.write_value_singular(["I", rowCount], mutasiBarangMasukJumlah)

                        workbook.write_value_singular(["J", rowCount], mutasiBarangKeluarJumlahSatuan)
                        workbook.write_value_singular(["K", rowCount], hargaSatuan)
                        workbook.write_value_singular(["L", rowCount], mutasiBarangKeluarJumlah)

                        workbook.write_value_singular(["M", rowCount], saldoAkhirJumlahSatuan)
                        workbook.write_value_singular(["N", rowCount], hargaSatuan)
                        workbook.write_value_singular(["O", rowCount], saldoAkhirJumlah)

                        workbook.font_multiple(["A", rowCount], ["O", rowCount], size = 10)
                        workbook.alignment_multiple(["A", rowCount], ["O", rowCount], vertical = "top", horizontal = "center")
                        workbook.alignment_singular(["B", rowCount], vertical = "top", horizontal = "left")
                        workbook.border_multiple(["A", rowCount], ["O", rowCount], "all", style = "thin")

                        rowCount += 1
                        itemCount += 1
        

                if(categoryObject.get("barang")):
                    workbook.border_multiple(["A", rowCount], ["O", rowCount], "all", style = "thin")
                    rowCount += 1
                    
                workbook.write_value_singular(["B", rowCount], f"SUB TOTAL {categoryObject.get('kategori')}")
                workbook.write_value_singular(["F", rowCount], saldoJumlahSubTotal)
                workbook.write_value_singular(["I", rowCount], mutasiBarangMasukJumlahSubTotal)
                workbook.write_value_singular(["L", rowCount], mutasiBarangKeluarJumlahSubTotal)
                workbook.write_value_singular(["O", rowCount], saldoAkhirJumlahSubTotal)

                workbook.font_multiple(["A", rowCount], ["O", rowCount], size = 10, bold = True)
                workbook.alignment_multiple(["A", rowCount], ["O", rowCount], vertical = "top")
                workbook.border_multiple(["A", rowCount], ["O", rowCount], "all", style = "thin")

                if(categoryCount == 1):
                    footerString += f" {romanNumeral}"

                if(categoryCount != 1):
                    footerString += f"+{romanNumeral}"

                saldoJumlahTotal += saldoJumlahSubTotal
                mutasiBarangMasukJumlahTotal += mutasiBarangMasukJumlahSubTotal
                mutasiBarangKeluarJumlahTotal += mutasiBarangKeluarJumlahSubTotal
                saldoAkhirJumlahTotal += saldoAkhirJumlahSubTotal

                rowCount += 1
                workbook.border_multiple(["A", rowCount], ["O", rowCount], "all", style = "thin")
                rowCount += 1
                

        workbook.write_value_singular(["A", rowCount], footerString)

        workbook.write_value_singular(["F", rowCount], saldoJumlahTotal)
        workbook.write_value_singular(["I", rowCount], mutasiBarangMasukJumlahTotal)
        workbook.write_value_singular(["L", rowCount], mutasiBarangKeluarJumlahTotal)
        workbook.write_value_singular(["O", rowCount], saldoAkhirJumlahTotal)

        workbook.font_multiple(["A", rowCount], ["C", rowCount], size = 10, bold = True)
        workbook.font_multiple(["D", rowCount], ["O", rowCount], size = 11, bold = True)
        workbook.alignment_multiple(["A", rowCount], ["O", rowCount], vertical = "top")
        workbook.border_multiple(["A", rowCount], ["O", rowCount], "all", style = "thin")
        
        workbook.adjust_width("A4", ["O", rowCount - 1], width_limit = 35)
        workbook.alignment_singular("B4", vertical = "center", horizontal = "center")

        rowCount += 2
        workbook.write_value_singular(["L", rowCount], f"Balikpapan, {dependencyData['tanggal_akhir']} {dependencyData['bulan_akhir']} {dependencyData['tahun_akhir']}")
        workbook.alignment_singular(["L", rowCount], horizontal = "center")
        workbook.merge(["L", rowCount], ["N", rowCount])

        rowCount += 1
        workbook.write_value_singular(["B", rowCount], "Plt. Kasubag Umum")
        workbook.alignment_singular(["B", rowCount], horizontal = "center")
        workbook.merge(["B", rowCount], ["C", rowCount])

        workbook.write_value_singular(["L", rowCount], "Pengurus Barang Pengguna")
        workbook.alignment_singular(["L", rowCount], horizontal = "center")
        workbook.merge(["L", rowCount], ["N", rowCount])

        rowCount += 4
        workbook.write_value_singular(["B", rowCount], dependencyData['plt_kasubag_umum'])
        workbook.alignment_singular(["B", rowCount], horizontal = "center")
        workbook.merge(["B", rowCount], ["C", rowCount])

        workbook.write_value_singular(["L", rowCount], dependencyData['pengurus_barang_pengguna'])
        workbook.alignment_singular(["L", rowCount], horizontal = "center")
        workbook.merge(["L", rowCount], ["N", rowCount])

        rowCount += 1
        workbook.write_value_singular(["F", rowCount], "Mengetahui,")
        workbook.font_singular(["F", rowCount], bold = True)
        workbook.alignment_singular(["F", rowCount], horizontal = "center")
        workbook.merge(["F", rowCount], ["H", rowCount])

        rowCount += 1
        workbook.write_value_singular(["F", rowCount], "Kepala Dinas Ketenagakerjaan")
        workbook.font_singular(["F", rowCount], bold = True)
        workbook.alignment_singular(["F", rowCount], horizontal = "center")
        workbook.merge(["F", rowCount], ["H", rowCount])

        InventoryMaster.generateFooterImage(dependencyData["sekretaris_dinas"])
        excelImage = ExcelImage("./media/master footer/Master Footer Image.png")
        workbook.active_sheet.add_image(excelImage, f"B{rowCount}")

        rowCount += 1
        workbook.write_value_singular(["F", rowCount], "Kota Balikpapan")
        workbook.font_singular(["F", rowCount], bold = True)
        workbook.alignment_singular(["F", rowCount], horizontal = "center")
        workbook.merge(["F", rowCount], ["H", rowCount])

        rowCount += 4
        workbook.write_value_singular(["F", rowCount], dependencyData['kepala_dinas_ketenagakerjaan'])
        workbook.font_singular(["F", rowCount], bold = True)
        workbook.alignment_singular(["F", rowCount], horizontal = "center")
        workbook.merge(["F", rowCount], ["H", rowCount])


    def generateFooterImage(text):
        middleHeaderMasterFooterObject = Pillow("./media/master footer/Middle Header Master Footer Image.png")
        middleTemplateMasterFooterObject = Pillow("./media/master footer/Middle Template Master Footer Image.png", (191, 77))

        fontSize = 11
        font = ImageFont.truetype("calibri.ttf", fontSize)
        
        textWidthRange = int(middleTemplateMasterFooterObject.width // 1.25)
        textWidth, textHeight = middleTemplateMasterFooterObject.checkTextSize(text, font)

        if textWidthRange > textWidth:
            while textWidthRange > textWidth:
                fontSize += 1
                font = ImageFont.truetype("calibri.ttf", fontSize)

                textWidth, textHeight = middleTemplateMasterFooterObject.checkTextSize(text, font)


        elif textWidthRange < textWidth:
            while textWidthRange < textWidth:
                fontSize -= 1
                font = ImageFont.truetype("calibri.ttf", fontSize)

                textWidth, textHeight = middleTemplateMasterFooterObject.checkTextSize(text, font)


        middleTemplateMasterFooterObject.drawText((8, (middleTemplateMasterFooterObject.height - textHeight)//2), text, font, "black")
        middleTemplateMasterFooterObject.drawLine((0, 0, middleTemplateMasterFooterObject.width-1, 0), "black", 1)
        middleTemplateMasterFooterObject.drawLine((0, 0, 0, middleTemplateMasterFooterObject.height-1), "black", 1)
        middleTemplateMasterFooterObject.drawLine((middleTemplateMasterFooterObject.width-1, 0, middleTemplateMasterFooterObject.width-1, middleTemplateMasterFooterObject.height-1), "black", 1)
        middleTemplateMasterFooterObject.drawLine((0, middleTemplateMasterFooterObject.height-1, middleTemplateMasterFooterObject.width-1, middleTemplateMasterFooterObject.height-1), "black", 1)
        middleTemplateMasterFooterObject.save()

        middleMasterFooterObject = Pillow("./media/master footer/Middle Master Footer Image.png", (middleHeaderMasterFooterObject.width, (middleHeaderMasterFooterObject.height + middleTemplateMasterFooterObject.height - 1)))
        middleMasterFooterObject.image.paste(middleTemplateMasterFooterObject.image, (0, (middleMasterFooterObject.height - middleTemplateMasterFooterObject.height)))
        middleMasterFooterObject.image.paste(middleHeaderMasterFooterObject.image, (0, (middleMasterFooterObject.height -  middleHeaderMasterFooterObject.height - middleTemplateMasterFooterObject.height + 1)))

        middleMasterFooterObject.save()

        leftMasterFooterObject = Pillow("./media/master footer/Left Master Footer Image.png")
        rightMasterFooterObject = Pillow("./media/master footer/Right Master Footer Image.png")

        masterFooterObject = Pillow("./media/master footer/Master Footer Image.png", ((leftMasterFooterObject.width + middleMasterFooterObject.width + rightMasterFooterObject.width - 2), 113))
        masterFooterObject.image.paste(rightMasterFooterObject.image, ((masterFooterObject.width - rightMasterFooterObject.width), 0))
        masterFooterObject.image.paste(middleMasterFooterObject.image, ((masterFooterObject.width - middleMasterFooterObject.width - rightMasterFooterObject.width + 1), 0))
        masterFooterObject.image.paste(leftMasterFooterObject.image, ((masterFooterObject.width - leftMasterFooterObject.width - middleMasterFooterObject.width - rightMasterFooterObject.width + 2), 0))

        masterFooterObject.resize((420, 89))
        masterFooterObject.save()


    def getDependencyData():
        collection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryDependency)
        inventoryDependencyDocument = collection.find_one({"id": 1}, { "id": False, "_id": False })

        return inventoryDependencyDocument


    def getTranslatedDependencyData():
        rawDependencyData = InventoryMaster.getDependencyData()

        dependencyData = {
            "semester": Utility.romanNumeral(rawDependencyData.get("semester")),
            "tanggal_awal": rawDependencyData.get("tanggal_awal"),
            "bulan_awal" : Utility.translateMonthName(Utility.convertNumberToMonthName(rawDependencyData.get("bulan_awal"))),
            "tahun_awal": rawDependencyData.get("tahun_awal"),
            "tanggal_akhir": rawDependencyData.get("tanggal_akhir"),
            "bulan_akhir" : Utility.translateMonthName(Utility.convertNumberToMonthName(rawDependencyData.get("bulan_akhir"))),
            "tahun_akhir": rawDependencyData.get("tahun_akhir"),
            "pengurus_barang_pengguna": rawDependencyData.get("pengurus_barang_pengguna"),
            "plt_kasubag_umum": rawDependencyData.get("plt_kasubag_umum"),
            "sekretaris_dinas": rawDependencyData.get("sekretaris_dinas"),
            "kepala_dinas_ketenagakerjaan": rawDependencyData.get("kepala_dinas_ketenagakerjaan")
        }

        Utility.writeJSON("./json/master_dependency_data.json", dependencyData)
        return dependencyData

    
    def updateDependencyData(dependencyData):
        if(dependencyData.semester not in (1, 2)):
            return {"success": False, "message": "Semester tidak valid"}

        month_list = [x for x in range(1, 13)]
        if(dependencyData.bulan_awal not in month_list):
            return {"success": False, "message": "Bulan awal tidak valid"}

        if(dependencyData.bulan_akhir not in month_list):
            return {"success": False, "message": "Bulan Akhir tidak valid"}

        dependencyData = {
            "id": 1,
            "semester": int(dependencyData.semester),
            "tanggal_awal": int(dependencyData.tanggal_awal),
            "bulan_awal" : int(dependencyData.bulan_awal),
            "tahun_awal": int(dependencyData.tahun_awal),
            "tanggal_akhir": int(dependencyData.tanggal_akhir),
            "bulan_akhir" : int(dependencyData.bulan_akhir),
            "tahun_akhir": int(dependencyData.tahun_akhir),
            "pengurus_barang_pengguna": dependencyData.pengurus_barang_pengguna,
            "plt_kasubag_umum": dependencyData.plt_kasubag_umum,
            "sekretaris_dinas": dependencyData.sekretaris_dinas,
            "kepala_dinas_ketenagakerjaan": dependencyData.kepala_dinas_ketenagakerjaan
        }

        collection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryDependency)
        collection.replace_one({"id": dependencyData["id"]}, dependencyData, upsert=True)

        return {"success": True}

    
    def updateOptionData():
        files = os.listdir("../spreadsheets/inventories/master")

        files.remove(".gitkeep")
        
        fileOptionArray = [["Mentah", [["Terbaru", True]]], ["Format", [["Terbaru", True]]]]

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

        
        Utility.writeJSON("./json/master_option_data.json", fileOptionData)
