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
import { useAppSelector } from "@/client/hooks/useAppSelector";
import { RootState } from "@/client/redux/store";
import { useAppDispatch } from "@/client/hooks/useAppDispatch";
import { setTableData } from "@/client/redux/features/tableDataSlice";
import { ReactNode, useEffect, useMemo, useRef } from "react";
import { InventoryDataPayload } from "@/shared/typings/interfaces/inventory-payload.interface";
import { Column, useTable } from "react-table";
import { Table } from "@/components/Table";
import axios from "axios";
import { useQuery } from "react-query";
import { Button, LinkOverlay, Menu, MenuButton, MenuItem, MenuList, useDisclosure } from "@chakra-ui/react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    Portal,
} from "@chakra-ui/react";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import { setLoading } from "@/client/redux/features/loadingSlice";

const MenuFC = () => {
    {
        <Menu>
            <MenuButton as={Button}>Actions</MenuButton>
            <MenuList>
                <MenuItem>
                    <LinkOverlay href={`/inventory/create`}>Update</LinkOverlay>
                </MenuItem>
            </MenuList>
        </Menu>;
    }
};

const createArr = (n: number, tableData: any): InventoryDataPayload[] => {
    const data: any[] = [];
    for (let i = 0; i < n; i += 1) {
        tableData.map((item: any, index: any) => {
            data.push({
                actions: {
                    category_id: item.actions.category_id,
                    item_id: item.actions.item_id,
                    isKategori: item.actions.isKategori,
                },
                no: item.no,
                uraian_barang: item.uraian_barang,
                satuan: item.satuan,
                saldo_jumlah_satuan: item.saldo_jumlah_satuan,
                saldo_harga_satuan: item.saldo_harga_satuan,
                saldo_jumlah: item.saldo_jumlah,
                mutasi_barang_masuk_jumlah_satuan: item.mutasi_barang_masuk_jumlah_satuan,
                mutasi_barang_masuk_harga_satuan: item.mutasi_barang_masuk_harga_satuan,
                mutasi_barang_masuk_jumlah: item.mutasi_barang_masuk_jumlah,
                mutasi_barang_keluar_jumlah_satuan: item.mutasi_barang_keluar_jumlah_satuan,
                mutasi_barang_keluar_harga_satuan: item.mutasi_barang_keluar_harga_satuan,
                mutasi_barang_keluar_jumlah: item.mutasi_barang_keluar_jumlah,
                saldo_akhir_jumlah_satuan: item.saldo_akhir_jumlah_satuan,
                saldo_akhir_harga_satuan: item.saldo_akhir_harga_satuan,
                saldo_akhir_jumlah: item.saldo_akhir_jumlah,
            });
        });
    }
    return data;
};

const TableInstance = ({ tableData }: any) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef();
    const dispatch = useAppDispatch();
    const loading = useAppSelector((state: RootState) => state.loading.value);

    const deleteKategori = (type: any, kategoriId: any, itemId?: any) => {
        if (type === "kategori") {
            dispatch(setLoading(true));
            axiosInstance
                .delete(`/__api/data/inventory/master/delete/kategori/${kategoriId}`, { withCredentials: true })
                .then((res) => {
                    dispatch(setLoading(false));

                    console.log(res);

                    window.location.reload();
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        if (type === "barang") {
            dispatch(setLoading(true));

            axiosInstance
                .delete(`/__api/data/inventory/master/delete/kategori/${kategoriId}/item/${itemId}`, {
                    withCredentials: true,
                })
                .then((res) => {
                    console.log(res);
                    dispatch(setLoading(false));

                    window.location.reload();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const data = useMemo<InventoryDataPayload[]>(() => createArr(1, tableData), []);
    const columns = useMemo<Column<InventoryDataPayload>[]>(
        () => [
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ value }) => {
                    if (value.isKategori) {
                        return (
                            <>
                                <Popover>
                                    <PopoverTrigger>
                                        <Button>Actions</Button>
                                    </PopoverTrigger>
                                    <Portal>
                                        <PopoverContent>
                                            <PopoverArrow />
                                            <PopoverCloseButton />
                                            <PopoverBody>
                                                <Button mx={2} colorScheme="teal" onClick={onOpen}>
                                                    Update
                                                </Button>

                                                <Button
                                                    mx={2}
                                                    colorScheme="red"
                                                    isLoading={loading}
                                                    onClick={() =>
                                                        deleteKategori("kategori", value.category_id, value.item_id)
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Portal>
                                </Popover>
                            </>
                        );
                    }
                    return (
                        <>
                            <Popover>
                                <PopoverTrigger>
                                    <Button>Actions</Button>
                                </PopoverTrigger>
                                <Portal>
                                    <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverBody>
                                            <Button mx={2} colorScheme="teal">
                                                Update
                                            </Button>
                                            <Button
                                                mx={2}
                                                colorScheme="red"
                                                isLoading={loading}
                                                onClick={() =>
                                                    deleteKategori("barang", value.category_id, value.item_id)
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Portal>
                            </Popover>
                        </>
                    );
                },
            },
            {
                Header: "No",
                accessor: "no",
                Cell: ({ value }) => {
                    // if (categories_roman.includes(value)) {
                    //     return <strong>{value}</strong>;
                    // }
                    return value;
                },
            },
            {
                Header: "Uraian Barang",
                accessor: "uraian_barang",
                Cell: ({ value }) => {
                    // if (categories.some((item: any) => item.kategori === value)) {
                    //     return <strong>{value}</strong>;
                    // }
                    return value;
                },
            },
            {
                Header: "Satuan",
                accessor: "satuan",
            },
            {
                Header: "Saldo",
                columns: [
                    {
                        Header: "Jumlah Satuan",
                        accessor: "saldo_jumlah_satuan",
                    },
                    {
                        Header: "Harga Satuan",
                        accessor: "saldo_harga_satuan",
                    },
                    {
                        Header: "Jumlah (Rp)",
                        accessor: "saldo_jumlah",
                    },
                ],
            },
            {
                Header: "Mutasi Barang Masuk",
                columns: [
                    {
                        Header: "Jumlah Satuan",
                        accessor: "mutasi_barang_masuk_jumlah_satuan",
                    },
                    {
                        Header: "Harga Satuan",
                        accessor: "mutasi_barang_masuk_harga_satuan",
                    },
                    {
                        Header: "Jumlah (Rp)",
                        accessor: "mutasi_barang_masuk_jumlah",
                    },
                ],
            },
            {
                Header: "Mutasi Barang Keluar",
                columns: [
                    {
                        Header: "Jumlah Satuan",
                        accessor: "mutasi_barang_keluar_jumlah_satuan",
                    },
                    {
                        Header: "Harga Satuan",
                        accessor: "mutasi_barang_keluar_harga_satuan",
                    },
                    {
                        Header: "Jumlah (Rp)",
                        accessor: "mutasi_barang_keluar_jumlah",
                    },
                ],
            },
            {
                Header: "Saldo Akhir",
                columns: [
                    {
                        Header: "Jumlah Satuan",
                        accessor: "saldo_akhir_jumlah_satuan",
                    },
                    {
                        Header: "Harga Satuan",
                        accessor: "saldo_akhir_harga_satuan",
                    },
                    {
                        Header: "Jumlah (Rp)",
                        accessor: "saldo_akhir_jumlah",
                    },
                ],
            },
        ],
        []
    );
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<InventoryDataPayload>({
        columns,
        data,
    });

    return (
        <Table<InventoryDataPayload>
            getTableProps={getTableProps}
            getTableBodyProps={getTableBodyProps}
            headerGroups={headerGroups}
            rows={rows}
            prepareRow={prepareRow}
        />
    );
};

const DashboardInventoryActions: NextPage = () => {
    const tableData = useAppSelector((state: RootState) => state.tabelData.data);
    const dispatch = useAppDispatch();

    const fetchTableData = () =>
        axios
            .get("http://localhost:3000/__api/data/inventory/table", { withCredentials: true })
            .then((response) => response.data);

    const tableDataQuery = useQuery("tableData", fetchTableData);

    useEffect(() => {
        if (tableDataQuery.isSuccess) {
            dispatch(setTableData(tableDataQuery.data));
        }
    }, [tableDataQuery]);

    return (
        <Sidebar type="inventory">
            <div>
                <>
                    {tableDataQuery.isLoading || !tableData ? (
                        <div>Loading...</div>
                    ) : (
                        <TableInstance tableData={tableData} />
                    )}
                </>
            </div>
        </Sidebar>
    );
};

export default DashboardInventoryActions;
