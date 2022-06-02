/**
 * administrare - web platform for internal data management
 * Copyright (C) 2022 imperatoria
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { NextPage } from "next";
import Sidebar from "@/components/dashboard/sidebar/Sidebar";

const DashboardMain: NextPage = () => {
    return (
        <Sidebar type="inventory">
            <div>
                <h1 className="title">Dashboard</h1>
            </div>
            {/* <Menu>
                <MenuButton as={Button}>Actions</MenuButton>
                <MenuList>
                    <MenuItem>
                        <LinkOverlay href={`/inventory/create`}>Create</LinkOverlay>
                    </MenuItem>
                </MenuList>
            </Menu> */}
        </Sidebar>
    );
};

export default DashboardMain;
