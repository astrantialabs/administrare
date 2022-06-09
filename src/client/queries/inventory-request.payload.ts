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

import { axiosInstance } from "@/shared/utils/axiosInstance";
import { useQuery } from "react-query";

export type InventoryRequestItem = {
    id: number;
    kategori_id: number;
    barang_id: number;
    username: string;
    total: number;
    deskripsi: string | null;
    created_at: string;
    responded_at: string | null;
    status: number;
};

export type InventoryRequestItems = Array<InventoryRequestItem>;

const fetchInventoryRequestItems = async (): Promise<InventoryRequestItems> => {
    const response = await axiosInstance.get("__api/data/inventory/request/barang/all");
    return response.data;
};

export const useInventoryRequestItemsQuery = () => useQuery(["inventory-request-items"], () => fetchInventoryRequestItems());
