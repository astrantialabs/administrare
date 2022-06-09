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
        master_inventory_document = collection.find_one({"tahun": 2022})
        
        MasterInventory.writeHeader(workbook)
        MasterInventory.writeBody(workbook, master_inventory_document)

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

    
    def writeBody(workbook, master_inventory_document):
        rowStart = 6
        for categoryIndex, categoryObject in enumerate(master_inventory_document.get("kategori")):
            workbook.write_value_singular(["A", rowStart], f"{Utility.romanNumeral(categoryIndex + 1)}.")
            workbook.write_value_singular(["B", rowStart], categoryObject.get("kategori"))

            rowStart += 1

            saldoJumlahTotal = 0
            mutasiBarangMasukJumlahTotal = 0
            mutasiBarangKeluarJumlahTotal = 0
            saldoAkhirJumlahTotal = 0
            for itemIndex, itemObject in enumerate(categoryObject.get("barang")):
                hargaSatuan = itemObject.get("harga_satuan")

                saldoJumlahSatuan = itemObject.get("saldo_jumlah_satuan")
                saldoJumlah = saldoJumlahSatuan * hargaSatuan
                saldoJumlahTotal += saldoJumlah

                mutasiBarangMasukJumlahSatuan = itemObject.get("mutasi_barang_masuk_jumlah_satuan")
                mutasiBarangMasukJumlah = mutasiBarangMasukJumlahSatuan * hargaSatuan
                mutasiBarangMasukJumlahTotal += mutasiBarangMasukJumlah

                mutasiBarangKeluarJumlahSatuan = itemObject.get("mutasi_barang_keluar_jumlah_satuan")
                mutasiBarangKeluarJumlah = mutasiBarangKeluarJumlahSatuan * hargaSatuan
                mutasiBarangKeluarJumlahTotal += mutasiBarangKeluarJumlah

                saldoAkhirJumlahSatuan = itemObject.get("saldo_akhir_jumlah_satuan")
                saldoAkhirJumlah = saldoAkhirJumlahSatuan * hargaSatuan
                saldoAkhirJumlahTotal += saldoAkhirJumlah

                workbook.write_value_singular(["A", rowStart], itemIndex + 1)
                workbook.write_value_singular(["B", rowStart], itemObject.get("nama"))
                workbook.write_value_singular(["C", rowStart], itemObject.get("satuan"))

                workbook.write_value_singular(["D", rowStart], saldoJumlahSatuan)
                workbook.write_value_singular(["E", rowStart], hargaSatuan)
                workbook.write_value_singular(["F", rowStart], saldoJumlah)

                workbook.write_value_singular(["G", rowStart], mutasiBarangMasukJumlahSatuan)
                workbook.write_value_singular(["H", rowStart], hargaSatuan)
                workbook.write_value_singular(["I", rowStart], mutasiBarangMasukJumlah)

                workbook.write_value_singular(["J", rowStart], mutasiBarangKeluarJumlahSatuan)
                workbook.write_value_singular(["K", rowStart], hargaSatuan)
                workbook.write_value_singular(["L", rowStart], mutasiBarangKeluarJumlah)

                workbook.write_value_singular(["M", rowStart], saldoAkhirJumlahSatuan)
                workbook.write_value_singular(["N", rowStart], hargaSatuan)
                workbook.write_value_singular(["O", rowStart], saldoAkhirJumlah)

                rowStart += 1


            if(categoryObject.get("barang")):
                rowStart += 1

            workbook.write_value_singular(["B", rowStart], f"SUB TOTAL {categoryObject.get('kategori')}")
            workbook.write_value_singular(["F", rowStart], saldoJumlahTotal)
            workbook.write_value_singular(["I", rowStart], mutasiBarangMasukJumlahTotal)
            workbook.write_value_singular(["L", rowStart], mutasiBarangKeluarJumlahTotal)
            workbook.write_value_singular(["O", rowStart], saldoAkhirJumlahTotal)

            rowStart += 2
                

            