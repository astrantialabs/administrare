from dotenv import dotenv_values

class Dependency():
    environtmentValues = dotenv_values("./.env")

    #region Main
    mongoDBURI = environtmentValues.get("CLUSTER_URI")
    mainFilePath = "spreadsheets"

    #endregion Main
    
    #region Finance
    databaseFinance = environtmentValues.get("DATABASE_FINANCE")
    financeFilePath = "finances"

    collectionMasterFinance = environtmentValues.get("DATABASE_MASTER_FINANCE_COLLECTION")
    masterFinanceFilePath = "master"

    #endregion Finance

    #region Inventory
    databaseInventory = environtmentValues.get("DATABASE_INVENTORY")
    inventoryFilePath = "inventories"
    
    collectionMasterInventory = environtmentValues.get("DATABASE_MASTER_TEST_INVENTORY_COLLECTION")
    masterInventoryFilePath = "master"
    
    collectionDemandInventory = environtmentValues.get("DATABASE_DEMAND_INVENTORY_COLLECTION")
    demandInventoryFilePath = "demand"
    
    collectionRequestInventory = environtmentValues.get("DATABASE_REQUEST_INVENTORY_COLLECTION")
    requestInventoryFilePath = "request"

    #endregion Inventory

    #region Archive
    databaseArchive = environtmentValues.get("DATABASE_ARCHIVE")
    archiveFilePath = "archives"

    #endregion Archive