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
import React, { useEffect, useRef, useState } from "react";
import { Column, useTable } from "react-table";

import { buildServerSideProps } from "@/client/ssr/buildServerSideProps";
import { InventoryDataPayload } from "@/shared/typings/interfaces/inventory-payload.interface";
import { Table } from "@/components/Table";
import { fetch } from "@/shared/utils/fetch";
import Sidebar from "@/components/Sidebar";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import { useAppDispatch } from "@/client/hooks/useAppDispatch";

import { Button, LinkOverlay, Menu, MenuButton, MenuItem, MenuList, useDisclosure } from "@chakra-ui/react";
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverArrow, PopoverCloseButton, Portal } from "@chakra-ui/react";

type PageProps = {
    tableData: any;
    categories: any[];
    categories_roman: string[];
};

interface PayloadTest {
    actions: {
        category_id: string;
        item_id: string;
        isKategori: boolean;
        isWhiteSpace: boolean;
    };
    id: number;
    kategori: string;
    nama: string;
    satuan: string;
    saldo_jumlah_satuan: number;
    mutasi_barang_masuk_jumlah_satuan: number;
    mutasi_barang_keluar_jumlah_satuan: number;
    saldo_akhir_jumlah_satuan: number;
    jumlah_permintaan: number;
    harga_satuan: number;
    keterangan: string;
    saldo_jumlah_satuan_rp: string | number;
    mutasi_barang_masuk_jumlah_satuan_rp: string | number;
    mutasi_barang_keluar_jumlah_satuan_rp: string | number;
    saldo_akhir_jumlah_satuan_rp: string | number;
    isWhiteSpace: boolean;
}

const createArr = (n: number, tableData: any): PayloadTest[] => {
    const data: any[] = [];
    for (let i = 0; i < n; i += 1) {
        tableData.map((item: any, index: any) => {
            data.push({
                actions: {
                    category_id: item.actions.category_id,
                    item_id: item.actions.item_id,
                    isKategori: item.actions.isKategori,
                    isWhiteSpace: item.actions.isWhiteSpace,
                },
                id: item.id,
                kategori: item.kategori,
                nama: item.nama,
                satuan: item.satuan,
                saldo_jumlah_satuan: item.saldo_jumlah_satuan,
                mutasi_barang_masuk_jumlah_satuan: item.mutasi_barang_masuk_jumlah_satuan,
                mutasi_barang_keluar_jumlah_satuan: item.mutasi_barang_keluar_jumlah_satuan,
                saldo_akhir_jumlah_satuan: item.saldo_akhir_jumlah_satuan,
                jumlah_permintaan: item.jumlah_permintaan,
                harga_satuan: item.harga_satuan,
                keterangan: item.keterangan,
                saldo_jumlah_satuan_rp: item.saldo_jumlah_satuan_rp,
                mutasi_barang_masuk_jumlah_satuan_rp: item.mutasi_barang_masuk_jumlah_satuan_rp,
                mutasi_barang_keluar_jumlah_satuan_rp: item.mutasi_barang_keluar_jumlah_satuan_rp,
                saldo_akhir_jumlah_satuan_rp: item.saldo_akhir_jumlah_satuan_rp,
            });
        });
    }
    return data;
};

const InventoryManageIndex: NextPage<PageProps> = ({ tableData, categories, categories_roman }) => {
    const { onOpen } = useDisclosure();
    const [loading, setLoading] = useState(false);

    const deleteKategori = (type: any, kategoriId: any, itemId?: any) => {
        if (type === "kategori") {
            setLoading(true);
            axiosInstance
                .delete(`/__api/data/inventory/master/kategori/${kategoriId}`, { withCredentials: true })
                .then((res) => {
                    setLoading(false);

                    console.log(res);

                    window.location.reload();
                })
                .catch((err) => {
                    console.log(err);
                });
        }

        if (type === "barang") {
            setLoading(true);

            axiosInstance
                .delete(`/__api/data/inventory/master/kategori/${kategoriId}/barang/${itemId}`, {
                    withCredentials: true,
                })
                .then((res) => {
                    setLoading(false);

                    console.log(res);

                    window.location.reload();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const data = React.useMemo<PayloadTest[]>(() => createArr(1, tableData), []);

    const columns = React.useMemo<Column<PayloadTest>[]>(
        () => [
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ value }) => {
                    if (value.isWhiteSpace === true) {
                        return <span></span>;
                    }

                    if (value.isKategori === true) {
                        return (
                            <Popover>
                                <PopoverTrigger>
                                    <Button zIndex={1}>Actions</Button>
                                </PopoverTrigger>
                                <Portal>
                                    <PopoverContent>
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverBody>
                                            <Button mx={2} colorScheme="teal" onClick={onOpen}>
                                                <LinkOverlay href={`/inventory/update/kategori/${value.category_id}`}>Update</LinkOverlay>
                                            </Button>

                                            <Button
                                                mx={2}
                                                colorScheme="red"
                                                isLoading={loading}
                                                disabled={loading}
                                                onClick={() => deleteKategori("kategori", value.category_id, value.item_id)}
                                            >
                                                Delete
                                            </Button>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Portal>
                            </Popover>
                        );
                    } else {
                        return (
                            <>
                                <Popover>
                                    <PopoverTrigger>
                                        <Button zIndex={1}>Actions</Button>
                                    </PopoverTrigger>
                                    <Portal>
                                        <PopoverContent>
                                            <PopoverArrow />
                                            <PopoverCloseButton />
                                            <PopoverBody>
                                                <Button mx={2} colorScheme="teal">
                                                    <LinkOverlay href={`/inventory/update/kategori/${value.category_id}/barang/${value.item_id}`}>
                                                        Update
                                                    </LinkOverlay>
                                                </Button>
                                                <Button
                                                    mx={2}
                                                    colorScheme="red"
                                                    isLoading={loading}
                                                    disabled={loading}
                                                    onClick={() => deleteKategori("barang", value.category_id, value.item_id)}
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
                },
            },
            {
                Header: "No",
                accessor: "id",
                Cell: ({ value }: any) => {
                    if (categories.filter((item: any) => item.roman === value)) {
                        return <strong>{value}</strong>;
                    }
                    return value;
                },
            },
            {
                Header: "Uraian Barang",
                accessor: "nama",
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
                        Header: "Harga Satuan (Rp)",
                        accessor: "harga_satuan",
                        id: "harga_satuan_id",
                    },
                    {
                        Header: "Jumlah (Rp)",
                        accessor: "saldo_jumlah_satuan_rp",
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
                        Header: "Harga Satuan (Rp)",
                        accessor: "harga_satuan",
                        id: "mutasi_barang_masuk_jumlah_satuan_rp_id",
                    },
                    {
                        Header: "Jumlah (Rp)",
                        accessor: "mutasi_barang_masuk_jumlah_satuan_rp",
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
                        Header: "Harga Satuan (Rp)",
                        accessor: "harga_satuan",
                        id: "mutasi_barang_keluar_jumlah_satuan_rp_id",
                    },
                    {
                        Header: "Jumlah (Rp)",
                        accessor: "mutasi_barang_keluar_jumlah_satuan_rp",
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
                        Header: "Harga Satuan (Rp)",
                        accessor: "harga_satuan",
                        id: "saldo_akhir_jumlah_satuan_rp_id",
                    },
                    {
                        Header: "Jumlah (Rp)",
                        accessor: "saldo_akhir_jumlah_satuan_rp",
                    },
                ],
            },
            {
                Header: "Jumlah Permintaan",
                accessor: "jumlah_permintaan",
            },
            {
                Header: "Keterangan",
                accessor: "keterangan",
            },
        ],
        []
    );
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<PayloadTest>({
        columns,
        data,
    });
    return (
        <Sidebar type="inventory">
            <Table<PayloadTest>
                getTableProps={getTableProps}
                getTableBodyProps={getTableBodyProps}
                headerGroups={headerGroups}
                rows={rows}
                prepareRow={prepareRow}
            />
        </Sidebar>
    );
};

export const getServerSideProps = buildServerSideProps<PageProps>(async () => {
    const tableData = await fetch("/__api/data/inventory/master/table/all");
    const categories = await fetch("/__api/data/inventory/master/table/kategori/all");
    const categories_roman = await fetch("/__api/data/inventory/master/table/kategori/all");

    return { tableData, categories, categories_roman };
});

export default InventoryManageIndex;