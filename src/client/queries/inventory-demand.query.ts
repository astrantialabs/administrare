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

export type InventoryDemandCategory = {
    id: number;
    username: string;
    kategori: string;
    createad_at: string;
    responded_at: string | null;
    status: number;
};

export type InventoryDemandItem = {
    id: number;
    kategori_id: number;
    kategori_name: string;
    username: string;
    barang: string;
    satuan: string;
    createad_at: string;
    responded_at: string | null;
    status: number;
};

export type InventoryDemandCategories = Array<InventoryDemandCategory>;
export type InventoryDemandItems = Array<InventoryDemandItem>;

const fetchInventoryDemandCategories = async (): Promise<InventoryDemandCategories> => {
    const response = await axiosInstance.get("__api/data/inventory/demand/kategori/all");
    return response.data;
};

const fetchInventoryDemandItems = async (): Promise<InventoryDemandItems> => {
    const response = await axiosInstance.get("__api/data/inventory/demand/barang/all");
    return response.data;
};

export const useInventoryDemandCategoriesQuery = () => useQuery(["inventory-demand-categories"], () => fetchInventoryDemandCategories());

export const useInventoryDemandItemsQuery = () => useQuery(["inventory-demand-items"], () => fetchInventoryDemandItems());
