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
 # @fileoverview The App file.
 # @author Rizky Irswanda <rizky.irswanda115@gmail.com>
"""

from fastapi import FastAPI

from pydantic import BaseModel

from inventories.master.inventoryMaster import InventoryMaster

from inventories.request.inventoryRequest import InventoryRequest

from inventories.demand.inventoryDemand import InventoryDemand

from dependency import Dependency

from database import Database

class DependencyData(BaseModel):
    semester: int

    tanggal_awal: int

    bulan_awal: int

    tahun_awal: int

    tanggal_akhir: int

    bulan_akhir: int

    tahun_akhir: int

    pengurus_barang_pengguna: str

    plt_kasubag_umum: str

    sekretaris_dinas: str

    kepala_dinas_ketenagakerjaan: str

app = FastAPI()

@app.get("/test")
def test():
    try:
        print("Test")
    except:
        print("Error")

@app.get("/__api/inventory/master/get/dependency")
def inventoryMasterGetDependencyData():
    collection = Database.getCollection(Dependency.mongoDBURI, Dependency.databaseInventory, Dependency.collectionInventoryDependency)

    inventoryDependencyDocument = collection.find_one({"id": 1}, { "id": False, "_id": False })

    return inventoryDependencyDocument

@app.post("/__api/inventory/master/update/dependency")
def inventoryMasterUpdateDependencyData(dependencyData: DependencyData):
    InventoryMaster.updateDependencyData(dependencyData)

    return {"success": True}

@app.post("/__api/inventory/master/download/{currentDate}")
def inventoryMasterDownload(currentDate):
    try:
        InventoryMaster.main(currentDate)

        return {"success": True}
    except:
        return {"success": False}

@app.post("/__api/inventory/request/update")
def inventoryRequestUpdateData():
    try:
        InventoryRequest.updateUserData()

        InventoryRequest.updateOptionData()

        return {"success": True}
    except:
        return {"success": False}

@app.post("/__api/inventory/request/download/raw/{currentDate}")
def inventoryRequestRawDownload(currentDate):
    try:
        InventoryRequest.writeRaw(currentDate)

        return {"success": True}
    except:
        return {"success": False}

@app.post("/__api/inventory/request/download/user/{userId}/date/{dateId}")
def inventoryRequestUserDownload(userId, dateId):
    try:
        InventoryRequest.writeUser(userId, dateId)

        return {"success": True}
    except:
        return {"success": False}

@app.post("/__api/inventory/demand/download/{currentDate}")
def inventoryDemandDownload(currentDate):
    try:
        InventoryDemand.main(currentDate)

        return {"success": True}
    except:
        return {"success": False}

print(inventoryMasterGetDependencyData())