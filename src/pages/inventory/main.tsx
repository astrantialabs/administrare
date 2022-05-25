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
import React from "react";
import { Column, useTable } from "react-table";

import { buildServerSideProps } from "@/client/ssr/buildServerSideProps";
import { InventoryDataPayload } from "@/shared/typings/interfaces/inventory-payload.interface";
import { Table } from "@/components/Table";
import { fetch } from "@/shared/utils/fetch";

type PageProps = {
    tableData: any;
    categories: string[];
    categories_roman: string[];
};

const createArr = (n: number, tableData: any): InventoryDataPayload[] => {
    const data: any[] = [];
    for (let i = 0; i < n; i += 1) {
        tableData.map((item: any, index: any) => {
            data.push({
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

const InventoryIndex: NextPage<PageProps> = ({ tableData, categories, categories_roman }) => {
    const data = React.useMemo<InventoryDataPayload[]>(() => createArr(1, tableData), []);

    const columns = React.useMemo<Column<InventoryDataPayload>[]>(
        () => [
            {
                Header: "No",
                accessor: "no",
                Cell: ({ value }) => {
                    if (categories_roman.includes(value)) {
                        return <strong>{value}</strong>;
                    }
                    return value;
                },
            },
            {
                Header: "Uraian Barang",
                accessor: "uraian_barang",
                Cell: ({ value }) => {
                    if (categories.includes(value)) {
                        return <strong>{value}</strong>;
                    }
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
        <div className="section">
            <Table<InventoryDataPayload>
                getTableProps={getTableProps}
                getTableBodyProps={getTableBodyProps}
                headerGroups={headerGroups}
                rows={rows}
                prepareRow={prepareRow}
            />
        </div>
    );
};

export const getServerSideProps = buildServerSideProps<PageProps>(async () => {
    const tableData = await fetch("/api/data/inventory/table");
    const categories = await fetch("/api/data/inventory/categories");
    const categories_roman = await fetch("/api/data/inventory/categories/roman");

    return { tableData, categories, categories_roman };
});

export default InventoryIndex;
