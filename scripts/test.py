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
 # @fileoverview The Test file.
 # @author Rizky Irswanda <rizky.irswanda115@gmail.com>
"""

from utility import Utility

from inventories.master.inventoryMaster import InventoryMaster
from inventories.request.inventoryRequest import InventoryRequest
from inventories.demand.inventoryDemand import InventoryDemand

class Test:
    def main():
        # InventoryMaster.main(Utility.currentDate())

        # InventoryRequest.updateUserData()
        # InventoryRequest.updateOptionData()
        # InventoryRequest.writeRaw(Utility.currentDate()) 
        
        optionData = Utility.readJSON("./json/option_data.json")
        for userObject in optionData:
            userId = userObject.get("id")
            if(userId != 1):
                for dateObject in userObject.get("date"):
                    dateId = dateObject.get("id")

                    InventoryRequest.writeUser(userId, dateId)
        

        # InventoryDemand.main(Utility.currentDate())


Test.main() # Make sure you are on /scripts directory