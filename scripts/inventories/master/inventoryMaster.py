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

import excel2img

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

        downloadData = InventoryMaster.getDownloadData()

        Excel.create_file(filePath)
        workbook = Excel(filePath)
        workbook.change_sheet_name("Sheet", f"Semester {downloadData['semester']}")
        workbook.set_zoom(85)

        InventoryMaster.writeHeader(workbook, downloadData)
        InventoryMaster.writeMain(workbook, inventoryMasterDocument, downloadData)

        workbook.save()


    def writeHeader(workbook, downloadData):
        workbook.write_value_multiple("A1", "A3", [f"LAPORAN INVENTARISASI PERSEDIAAN SEMESTER {downloadData['semester']} TAHUN {downloadData['tahun_akhir']}", f"PER {downloadData['tanggal_akhir']} {(downloadData['bulan_akhir']).upper()} {downloadData['tahun_akhir']}", "DINAS KETENAGAKERJAAN KOTA BALIKPAPAN"])
        workbook.write_value_multiple("A4", "C4", ["No", "Uraian Barang", "Satuan"])

        workbook.write_value_singular("D4", f"Saldo (Per {downloadData['tanggal_awal']} {downloadData['bulan_awal']} {downloadData['tahun_awal']})")
        workbook.write_value_singular("G4", "Mutasi Barang Masuk")
        workbook.write_value_singular("J4", "Mutasi Barang Keluar")
        workbook.write_value_singular("M4", f"Saldo Akhir (Per {downloadData['tanggal_akhir']} {downloadData['bulan_akhir']} {downloadData['tahun_akhir']})")

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


    def writeMain(workbook, inventoryMasterDocument, downloadData): 
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
        workbook.write_value_singular(["L", rowCount], f"Balikpapan, {downloadData['tanggal_akhir']} {downloadData['bulan_akhir']} {downloadData['tahun_akhir']}")
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
        workbook.write_value_singular(["B", rowCount], downloadData['plt_kasubag_umum'])
        workbook.alignment_singular(["B", rowCount], horizontal = "center")
        workbook.merge(["B", rowCount], ["C", rowCount])

        workbook.write_value_singular(["L", rowCount], downloadData['pengurus_barang_pengguna'])
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

        masterFooterFilePath = "./media/Master Footer Image"
        masterFooterWorkbook = Excel(f"{masterFooterFilePath}.xlsx")
        masterFooterWorkbook.write_value_singular("C3", downloadData["sekretaris_dinas"])
        masterFooterWorkbook.save()

        excel2img.export_img(f"{masterFooterFilePath}.xlsx", f"{masterFooterFilePath}.png", "", "sheet!B2:F3")
        
        image = Image.open(f"{masterFooterFilePath}.png").resize((420, 89))
        ImageOps.expand(image, border=1).save(f"{masterFooterFilePath}.png")

        excelImage = ExcelImage(f"{masterFooterFilePath}.png")
        workbook.active_sheet.add_image(excelImage, f"B{rowCount}")

        rowCount += 1
        workbook.write_value_singular(["F", rowCount], "Kota Balikpapan")
        workbook.font_singular(["F", rowCount], bold = True)
        workbook.alignment_singular(["F", rowCount], horizontal = "center")
        workbook.merge(["F", rowCount], ["H", rowCount])

        rowCount += 4
        workbook.write_value_singular(["F", rowCount], downloadData['kepala_dinas_ketenagakerjaan'])
        workbook.font_singular(["F", rowCount], bold = True)
        workbook.alignment_singular(["F", rowCount], horizontal = "center")
        workbook.merge(["F", rowCount], ["H", rowCount])


    def getDownloadData():
        collection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryDownload)
        inventoryDownloadDocument = collection.find_one({"id": 1})

        downloadData = {
            "semester": Utility.romanNumeral(inventoryDownloadDocument.get("semester")),
            "tanggal_awal": inventoryDownloadDocument.get("tanggal_awal"),
            "bulan_awal" : Utility.translateMonthName(Utility.convertNumberToMonthName(inventoryDownloadDocument.get("bulan_awal"))),
            "tahun_awal": inventoryDownloadDocument.get("tahun_awal"),
            "tanggal_akhir": inventoryDownloadDocument.get("tanggal_akhir"),
            "bulan_akhir" : Utility.translateMonthName(Utility.convertNumberToMonthName(inventoryDownloadDocument.get("bulan_akhir"))),
            "tahun_akhir": inventoryDownloadDocument.get("tahun_akhir"),
            "pengurus_barang_pengguna": inventoryDownloadDocument.get("pengurus_barang_pengguna"),
            "plt_kasubag_umum": inventoryDownloadDocument.get("plt_kasubag_umum"),
            "sekretaris_dinas": inventoryDownloadDocument.get("sekretaris_dinas"),
            "kepala_dinas_ketenagakerjaan": inventoryDownloadDocument.get("kepala_dinas_ketenagakerjaan")
        }

        Utility.writeJSON("./json/download_data.json", downloadData)
        return downloadData