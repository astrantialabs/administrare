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
 # @fileoverview The Dependency file.
 # @author Rizky Irswanda <rizky.irswanda115@gmail.com>
"""

from dotenv import dotenv_values

class Dependency():
    environtmentValues = dotenv_values("../.env")

    #region Main
    mongoDBURI = environtmentValues.get("CLUSTER_URI")
    mainFilePath = "spreadsheets"

    #endregion Main
    
    #region Finance
    databaseFinance = environtmentValues.get("DATABASE_FINANCE")
    financeFilePath = "finances"
    financeFolderPath = f"{mainFilePath}/{financeFilePath}"

    collectionFinanceMaster = environtmentValues.get("DATABASE_MASTER_FINANCE_COLLECTION")
    financeMasterFilePath = "master"
    financeMasterFolderPath = f"{financeFolderPath}/{financeMasterFilePath}"

    #endregion Finance

    #region Inventory
    databaseInventory = environtmentValues.get("DATABASE_INVENTORY")
    inventoryFilePath = "inventories"
    inventoryFolderPath = f"{mainFilePath}/{inventoryFilePath}"
    
    collectionInventoryMaster = environtmentValues.get("DATABASE_MASTER_INVENTORY_COLLECTION")
    inventoryMasterFilePath = "master"
    inventoryMasterFolderPath = f"{inventoryFolderPath}/{inventoryMasterFilePath}"
    
    collectionInventoryDemand = environtmentValues.get("DATABASE_DEMAND_INVENTORY_COLLECTION")
    inventoryDemandFilePath = "demand"
    inventoryDemandFolderPath = f"{inventoryFolderPath}/{inventoryDemandFilePath}"
    
    collectionInventoryRequest = environtmentValues.get("DATABASE_REQUEST_INVENTORY_COLLECTION")
    inventoryRequestFilePath = "request"
    inventoryRequestFolderPath = f"{inventoryFolderPath}/{inventoryRequestFilePath}"

    collectionInventoryDependency = environtmentValues.get("DATABASE_DEPENDENCY_INVENTORY_COLLECTION")

    #endregion Inventory

    #region Archive
    databaseArchive = environtmentValues.get("DATABASE_ARCHIVE")
    archiveFilePath = "archives"
    archiveFolderPath = f"{mainFilePath}/{archiveFilePath}"

    #endregion Archive