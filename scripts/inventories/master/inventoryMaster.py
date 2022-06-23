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

# import excel2img
from fastapi import HTTPException

from openpyxl.drawing.image import Image as ExcelImage
from PIL import Image, ImageOps

from dependency import Dependency
from excel import Excel
from database import Database
from utility import Utility

class InventoryMaster():
    def main(currentDate):
        filePath = f"../{Dependency.inventoryMasterFolderPath}/{currentDate}.xlsx"

        collection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryMaster)
        inventoryMasterDocument = collection.find_one({"tahun": 2022})

        dependencyData = InventoryMaster.getDependencyData()

        Excel.create_file(filePath)
        workbook = Excel(filePath)
        workbook.change_sheet_name("Sheet", f"Semester {dependencyData['semester']}")
        workbook.set_zoom(85)

        InventoryMaster.writeHeader(workbook, dependencyData)
        InventoryMaster.writeMain(workbook, inventoryMasterDocument, dependencyData)

        workbook.save()


    def writeHeader(workbook, dependencyData):
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


    def writeMain(workbook, inventoryMasterDocument, dependencyData): 
        rowCount = 6

        footerString = "Total"

        saldoJumlahTotal = 0
        mutasiBarangMasukJumlahTotal = 0
        mutasiBarangKeluarJumlahTotal = 0
        saldoAkhirJumlahTotal = 0
        for categoryIndex, categoryObject in enumerate(inventoryMasterDocument.get("kategori")):
            romanNumeral = Utility.romanNumeral(categoryIndex + 1)
            workbook.write_value_singular(["A", rowCount], f"{romanNumeral}.")
            workbook.write_value_singular(["B", rowCount], categoryObject.get("kategori"))

            workbook.font_multiple(["A", rowCount], ["B", rowCount], bold = True, size = 10)
            workbook.alignment_singular(["A", rowCount], vertical = "top", horizontal = "center")
            workbook.alignment_singular(["B", rowCount], vertical = "top", horizontal = "left")
            workbook.border_multiple(["A", rowCount], ["O", rowCount], "all", style = "thin")

            rowCount += 1

            saldoJumlahSubTotal = 0
            mutasiBarangMasukJumlahSubTotal = 0
            mutasiBarangKeluarJumlahSubTotal = 0
            saldoAkhirJumlahSubTotal = 0
            for itemIndex, itemObject in enumerate(categoryObject.get("barang")):
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

                workbook.write_value_singular(["A", rowCount], itemIndex + 1)
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

            if(categoryIndex == 0):
                footerString += f" {romanNumeral}"

            if(categoryIndex != 0):
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

        # masterFooterFilePath = "./media/Master Footer Image"
        # masterFooterWorkbook = Excel(f"{masterFooterFilePath}.xlsx")
        # masterFooterWorkbook.write_value_singular("C3", dependencyData["sekretaris_dinas"])
        # masterFooterWorkbook.save()

        # excel2img.export_img(f"{masterFooterFilePath}.xlsx", f"{masterFooterFilePath}.png", "", "sheet!B2:F3")
        
        # image = Image.open(f"{masterFooterFilePath}.png").resize((420, 89))
        # ImageOps.expand(image, border=1).save(f"{masterFooterFilePath}.png")

        # excelImage = ExcelImage(f"{masterFooterFilePath}.png")
        # workbook.active_sheet.add_image(excelImage, f"B{rowCount}")

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


    def getDependencyData():
        collection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryDependency)
        inventoryDependencyDocument = collection.find_one({"id": 1})

        dependencyData = {
            "semester": Utility.romanNumeral(inventoryDependencyDocument.get("semester")),
            "tanggal_awal": inventoryDependencyDocument.get("tanggal_awal"),
            "bulan_awal" : Utility.translateMonthName(Utility.convertNumberToMonthName(inventoryDependencyDocument.get("bulan_awal"))),
            "tahun_awal": inventoryDependencyDocument.get("tahun_awal"),
            "tanggal_akhir": inventoryDependencyDocument.get("tanggal_akhir"),
            "bulan_akhir" : Utility.translateMonthName(Utility.convertNumberToMonthName(inventoryDependencyDocument.get("bulan_akhir"))),
            "tahun_akhir": inventoryDependencyDocument.get("tahun_akhir"),
            "pengurus_barang_pengguna": inventoryDependencyDocument.get("pengurus_barang_pengguna"),
            "plt_kasubag_umum": inventoryDependencyDocument.get("plt_kasubag_umum"),
            "sekretaris_dinas": inventoryDependencyDocument.get("sekretaris_dinas"),
            "kepala_dinas_ketenagakerjaan": inventoryDependencyDocument.get("kepala_dinas_ketenagakerjaan")
        }

        Utility.writeJSON("./json/dependency_data.json", dependencyData)
        return dependencyData

    
    def updateDependencyData(dependencyData):
        if(dependencyData.semester not in (1, 2)):
            raise HTTPException(status_code=400, detail = "Semester value invalid")

        month_list = [x for x in range(1, 13)]
        if(dependencyData.bulan_awal not in month_list):
            raise HTTPException(status_code=400, detail = "Bulan Awal value invalid")

        if(dependencyData.bulan_akhir not in month_list):
            raise HTTPException(status_code=400, detail = "Bulan Akhir value invalid")

        dependencyData = {
            "id": 1,
            "semester": dependencyData.semester,
            "tanggal_awal": dependencyData.tanggal_awal,
            "bulan_awal" : dependencyData.bulan_awal,
            "tahun_awal": dependencyData.tahun_awal,
            "tanggal_akhir": dependencyData.tanggal_akhir,
            "bulan_akhir" : dependencyData.bulan_akhir,
            "tahun_akhir": dependencyData.tahun_akhir,
            "pengurus_barang_pengguna": dependencyData.pengurus_barang_pengguna,
            "plt_kasubag_umum": dependencyData.plt_kasubag_umum,
            "sekretaris_dinas": dependencyData.sekretaris_dinas,
            "kepala_dinas_ketenagakerjaan": dependencyData.kepala_dinas_ketenagakerjaan
        }

        collection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryDependency)
        collection.replace_one({"id": dependencyData["id"]}, dependencyData, upsert=True)