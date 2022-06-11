"""
 # administrare - web platform for internal data management
 # Copyright (C) 2022 imperatoria
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
 # @fileoverview The Main file.
 # @author Rizky Irswanda <rizky.irswanda115@gmail.com>
"""

from fastapi import FastAPI
from inventories.master.masterInventory import MasterInventory

app = FastAPI()

@app.get("/")
def home():
    try:
        MasterInventory.main()
        return {"success": True}

    except:
        return {"success": False}
    
