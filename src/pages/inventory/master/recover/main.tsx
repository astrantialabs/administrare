/**
 * administrare - web platform for internal data management
 * Copyright (C) 2022 astrantialabs
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

import { Button, LinkOverlay, Menu, MenuButton, MenuItem, MenuList, useDisclosure, ButtonGroup, useToast } from "@chakra-ui/react";
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverArrow, PopoverCloseButton, Portal } from "@chakra-ui/react";
import { MasterTotal } from "@/shared/typings/types/inventory";

type PageProps = {
    tableData: any;
    categories: any[];
    categories_roman: string[];
    total: MasterTotal;
};

interface PayloadTest {
    actions: {
        category_id: string;
        item_id: string;
        isKategori: boolean;
        isWhiteSpace: boolean;
        isRecoverable: boolean;
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
}

const createArr = (n: number, tableData: any): any[] => {
    const data: any[] = [];
    for (let i = 0; i < n; i += 1) {
        tableData.map((item: any, index: any) => {
            data.push({
                actions: {
                    category_id: item.id,
                    item_id: "",
                    isKategori: true,
                    isWhiteSpace: false,
                    isRecoverable: item.active,
                },
                id: item.id,
                kategori: item.kategori,
                nama: item.kategori,
                satuan: "",
                saldo_jumlah_satuan: "",
                mutasi_barang_masuk_jumlah_satuan: "",
                mutasi_barang_keluar_jumlah_satuan: "",
                saldo_akhir_jumlah_satuan: "",
                jumlah_permintaan: "",
                harga_satuan: "",
                keterangan: "",
                saldo_jumlah_satuan_rp: "",
                mutasi_barang_masuk_jumlah_satuan_rp: "",
                mutasi_barang_keluar_jumlah_satuan_rp: "",
                saldo_akhir_jumlah_satuan_rp: "",
            });

            if (typeof item.barang != "undefined" && item.barang != null && item.barang.length != null && item.barang.length > 0) {
                item.barang.forEach((barangItem: any, index: any) => {
                    data.push({
                        actions: {
                            category_id: item.id,
                            item_id: barangItem.id,
                            isKategori: false,
                            isWhiteSpace: false,
                            isRecoverable: barangItem.active,
                        },
                        id: barangItem.id,
                        kategori: barangItem.nama,
                        nama: barangItem.nama,
                        satuan: barangItem.satuan,
                        saldo_jumlah_satuan: barangItem.saldo_jumlah_satuan,
                        mutasi_barang_masuk_jumlah_satuan: barangItem.mutasi_barang_masuk_jumlah_satuan,
                        mutasi_barang_keluar_jumlah_satuan: barangItem.mutasi_barang_keluar_jumlah_satuan,
                        saldo_akhir_jumlah_satuan: barangItem.saldo_akhir_jumlah_satuan,
                        jumlah_permintaan: barangItem.jumlah_permintaan,
                        harga_satuan: barangItem.harga_satuan,
                        keterangan: barangItem.keterangan,
                        saldo_jumlah_satuan_rp: "-",
                        mutasi_barang_masuk_jumlah_satuan_rp: "-",
                        mutasi_barang_keluar_jumlah_satuan_rp: "-",
                        saldo_akhir_jumlah_satuan_rp: "-",
                    });
                });
            }
        });
    }
    return data;
};

const InventoryRecoverIndex: NextPage<PageProps> = ({ tableData, categories, categories_roman, total }) => {
    const { onOpen } = useDisclosure();
    const toast = useToast();

    const [loading, setLoading] = useState(false);

    const recoverKategoriBarang = (type: any, kategoriId: any, itemId?: any) => {
        if (type === "kategori") {
            setLoading(true);
            axiosInstance
                .put(`/__api/data/inventory/master/kategori/${kategoriId}/recover`, { withCredentials: true })
                .then((response) => {
                    if (response.data.success === true) {
                        toast({
                            title: "Kategori berhasil dipulihkan!",
                            description: response.data.message,
                            status: "success",
                            position: "bottom-right",
                            duration: 5000,
                            isClosable: true,
                        });

                        setLoading(false);
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                })
                .catch((error) => {
                    console.log(error);

                    if (error.response) {
                        if (error.response.data.success === false) {
                            toast({
                                title: "Kategori gagal dipulihkan!",
                                description: error.response.data.message,
                                status: "error",
                                position: "bottom-right",
                                duration: 5000,
                                isClosable: true,
                            });
                        }
                    } else {
                        toast({
                            title: "Kategori gagal dipulihkan!",
                            description: "Kategori baru gagal dipulihkan dari database.",
                            status: "error",
                            position: "bottom-right",
                            duration: 5000,
                            isClosable: true,
                        });

                        setLoading(false);
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                });
        }

        if (type === "barang") {
            setLoading(true);

            axiosInstance
                .put(`/__api/data/inventory/master/kategori/${kategoriId}/barang/${itemId}/recover`, {
                    withCredentials: true,
                })
                .then((response) => {
                    if (response.data.success === true) {
                        toast({
                            title: "Barang berhasil dipulihkan!",
                            description: response.data.message,
                            status: "success",
                            position: "bottom-right",
                            duration: 5000,
                            isClosable: true,
                        });

                        setLoading(false);
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                })
                .catch((error) => {
                    console.log(error);

                    if (error.response) {
                        if (error.response.data.success === false) {
                            toast({
                                title: "Barang gagal dipulihkan!",
                                description: error.response.data.message,
                                status: "error",
                                position: "bottom-right",
                                duration: 5000,
                                isClosable: true,
                            });
                        }
                    } else {
                        toast({
                            title: "Barang gagal dipulihkan!",
                            description: "Barang baru gagal dipulihkan dari database.",
                            status: "error",
                            position: "bottom-right",
                            duration: 5000,
                            isClosable: true,
                        });

                        setLoading(false);
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }
                });
        }
    };

    const data = React.useMemo<PayloadTest[]>(() => createArr(1, tableData), []);

    const columns = React.useMemo<Column<PayloadTest>[]>(
        () => [
            {
                Header: "Actions",
                accessor: "actions",
                Footer: "",
                Cell: ({ value }) => {
                    if (value.isWhiteSpace === true) {
                        return <span></span>;
                    }

                    if (value.isKategori === true) {
                        if (value.isRecoverable === true) {
                            return <span></span>;
                        } else {
                            return (
                                <Button size="sm" zIndex={1} onClick={() => recoverKategoriBarang("kategori", value.category_id, value.item_id)}>
                                    Pulihkan
                                </Button>
                            );
                        }
                    } else {
                        if (value.isRecoverable === true) {
                            return <span></span>;
                        } else {
                            return (
                                <Button size="sm" zIndex={1} onClick={() => recoverKategoriBarang("barang", value.category_id, value.item_id)}>
                                    Pulihkan
                                </Button>
                            );
                        }
                    }
                },
            },
            {
                Header: "No",
                accessor: "id",
                Footer: "",
            },
            {
                Header: "Uraian Barang",
                accessor: "nama",
                Footer: "",
            },
            {
                Header: "Satuan",
                accessor: "satuan",
                Footer: "",
            },
            {
                Header: "Saldo",
                Footer: "",
                columns: [
                    {
                        Header: "Jumlah Satuan",
                        accessor: "saldo_jumlah_satuan",
                        Footer: "",
                    },
                    {
                        Header: "Harga Satuan (Rp)",
                        accessor: "harga_satuan",
                        id: "harga_satuan_id",
                        Footer: "",
                    },
                    {
                        Header: "Jumlah (Rp)",
                        accessor: "saldo_jumlah_satuan_rp",
                        Footer: "",
                    },
                ],
            },
            {
                Header: "Mutasi Barang Masuk",
                Footer: "",
                columns: [
                    {
                        Header: "Jumlah Satuan",
                        accessor: "mutasi_barang_masuk_jumlah_satuan",
                        Footer: "",
                    },
                    {
                        Header: "Harga Satuan (Rp)",
                        accessor: "harga_satuan",
                        id: "mutasi_barang_masuk_jumlah_satuan_rp_id",
                        Footer: "",
                    },
                    {
                        Header: "Jumlah (Rp)",
                        accessor: "mutasi_barang_masuk_jumlah_satuan_rp",
                        Footer: "",
                    },
                ],
            },
            {
                Header: "Mutasi Barang Keluar",
                Footer: "",
                columns: [
                    {
                        Header: "Jumlah Satuan",
                        accessor: "mutasi_barang_keluar_jumlah_satuan",
                        Footer: "",
                    },
                    {
                        Header: "Harga Satuan (Rp)",
                        accessor: "harga_satuan",
                        id: "mutasi_barang_keluar_jumlah_satuan_rp_id",
                        Footer: "",
                    },
                    {
                        Header: "Jumlah (Rp)",
                        accessor: "mutasi_barang_keluar_jumlah_satuan_rp",
                        Footer: "",
                    },
                ],
            },
            {
                Header: "Saldo Akhir",
                Footer: "",
                columns: [
                    {
                        Header: "Jumlah Satuan",
                        accessor: "saldo_akhir_jumlah_satuan",
                        Footer: "",
                    },
                    {
                        Header: "Harga Satuan (Rp)",
                        accessor: "harga_satuan",
                        id: "saldo_akhir_jumlah_satuan_rp_id",
                        Footer: "",
                    },
                    {
                        Header: "Jumlah (Rp)",
                        accessor: "saldo_akhir_jumlah_satuan_rp",
                        Footer: "",
                    },
                ],
            },
            {
                Header: "Jumlah Permintaan",
                accessor: "jumlah_permintaan",
                Footer: "",
            },
            {
                Header: "Keterangan",
                accessor: "keterangan",
                Footer: "",
            },
        ],
        []
    );
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, footerGroups } = useTable<PayloadTest>({
        columns,
        data,
    });
    return (
        <Sidebar type="inventory">
            <Table<PayloadTest>
                getTableProps={getTableProps}
                getTableBodyProps={getTableBodyProps}
                headerGroups={headerGroups}
                footerGroups={footerGroups}
                rows={rows}
                prepareRow={prepareRow}
            />
        </Sidebar>
    );
};

export const getServerSideProps = buildServerSideProps<PageProps>(async () => {
    const tableData = await fetch("/__api/data/inventory/master/table/recover");
    const categories = await fetch("/__api/data/inventory/master/table/kategori/all");
    const categories_roman = await fetch("/__api/data/inventory/master/table/kategori/all");
    const total = await fetch("/__api/data/inventory/master/total");

    return { tableData, categories, categories_roman, total: total };
});

export default InventoryRecoverIndex;
