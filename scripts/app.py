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

from inventories.master.inventoryMaster import InventoryMaster
from inventories.request.inventoryRequest import InventoryRequest
from inventories.demand.inventoryDemand import InventoryDemand

app = FastAPI()

@app.get("/test")
def test():
    try:
        print("Test")

    except:
        print("Error")


@app.post("/__api/inventory/master/download/{currentDate}")
def inventoryMasterDownload(currentDate: str):
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
def inventoryRequestRawDownload(currentDate: str):
    try:
        InventoryRequest.writeRaw(currentDate)
        return {"success": True}

    except:
        return {"success": False}
    

@app.post("/__api/inventory/request/download/user/{userId}/date/{dateId}")
def inventoryRequestUserDownload(userId: int, dateId: int):
    try:
        InventoryRequest.writeUser(userId, dateId)
        return {"success": True}

    
    except:
        return {"success": False}


@app.post("/__api/inventory/demand/download/{currentDate}")
def inventoryDemandDownload(currentDate: str):
    try:
        InventoryDemand.main(currentDate)
        return {"success": True}

    except:
        return {"success": False}
 
