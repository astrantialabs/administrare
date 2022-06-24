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
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from inventories.master.inventoryMaster import InventoryMaster
from inventories.request.inventoryRequest import InventoryRequest
from inventories.demand.inventoryDemand import InventoryDemand

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

origins = [
    "http://inventory.setdisnakerbppn.com",
    "https://inventory.setdisnakerbppn.com",
    "http://localhost:3000",
    "https://localhost:3000",
    "http://localhost:3001",
    "https://localhost:3001",
    "http://0.0.0.0:3000",
    "https://0.0.0.0:3000",
    "http://0.0.0.0:3001",
    "https://0.0.0.0:3001"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["get", "post"],
    allow_headers=["*"],
)

@app.get("/test")
def test():
    try:
        print("Test")
    except:
        print("Error")


@app.get("/__api/inventory/master/get/dependency")
def inventoryMasterGetDependencyData():
    try:
        return {"success": True, "result": {"dependencyData": InventoryMaster.getDependencyData()}}

    except:
        return {"success": False}


@app.post("/__api/inventory/master/update/dependency")
def inventoryMasterUpdateDependencyData(dependencyData: DependencyData):
    return InventoryMaster.updateDependencyData(dependencyData)


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

