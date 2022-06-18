from utility import Utility

from inventories.master.inventoryMaster import InventoryMaster
from inventories.request.inventoryRequest import InventoryRequest
from inventories.demand.inventoryDemand import InventoryDemand

class Test:
    def main():
        InventoryMaster.main(Utility.currentDate())
        InventoryRequest.main(Utility.currentDate())
        InventoryDemand.main(Utility.currentDate())


Test.main() # Make sure you are on /scripts directory