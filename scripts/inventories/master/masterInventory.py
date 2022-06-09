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

