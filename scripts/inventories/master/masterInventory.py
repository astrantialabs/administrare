import datetime

from dependency import Dependency
from excel import Excel
from database import Database
from utility import Utility

class MasterInventory():
    folderPath = f"./{Dependency.mainFilePath}/{Dependency.inventoryFilePath}/{Dependency.masterInventoryFilePath}"

    def main():
        fileName = datetime.datetime.now().strftime("%y-%m-%d-%H-%M-%S")
        filePath = f"{MasterInventory.folderPath}/{fileName}.xlsx"

        Excel.create_file(filePath)
        workbook = Excel(filePath)

        collection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionMasterInventory)
        masterInventoryDocument = collection.find_one({"tahun": 2022})
        
        MasterInventory.writeHeader(workbook)
        MasterInventory.writeMain(workbook, masterInventoryDocument)

        workbook.save()


    def writeHeader(workbook):
        workbook.write_value_multiple("A1", "A3", ["LAPORAN INVENTARISASI PERSEDIAAN SEMESTER II TAHUN 2021", "PER 31 DESEMBER 2021", "DINAS KETENAGAKERJAAN KOTA BALIKPAPAN"])
        workbook.write_value_multiple("A4", "C4", ["No", "Uraian Barang", "Satuan"])

        workbook.write_value_singular("D4", "Saldo (Per 30 Juni 2021)")
        workbook.write_value_singular("G4", "Mutasi Barang Masuk")
        workbook.write_value_singular("J4", "Mutasi Barang Keluar")
        workbook.write_value_singular("M4", "Saldo Akhir (Per 31 Desember 2021)")

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


    def writeMain(workbook, masterInventoryDocument): 
        rowCount = 6

        footerString = "Total"

        saldoJumlahTotal = 0
        mutasiBarangMasukJumlahTotal = 0
        mutasiBarangKeluarJumlahTotal = 0
        saldoAkhirJumlahTotal = 0
        for categoryIndex, categoryObject in enumerate(masterInventoryDocument.get("kategori")):
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