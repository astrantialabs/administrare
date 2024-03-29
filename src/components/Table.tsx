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

import { Table as ChakraTable, TableContainer, Thead, Tbody, Tfoot, Tr, Th, Td, chakra } from "@chakra-ui/react";
import React from "react";
import { UseTableInstanceProps } from "react-table";

export interface TableNewProps<T extends object>
    extends Pick<UseTableInstanceProps<T>, "getTableProps" | "headerGroups" | "getTableBodyProps" | "prepareRow" | "rows" | "footerGroups"> {}

export function Table<T extends object>(props: TableNewProps<T>) {
    const { getTableProps, headerGroups, getTableBodyProps, rows, prepareRow, footerGroups } = props;

    return (
        <ChakraTable {...getTableProps()} borderTopWidth="1px" borderTopColor={`gray.200`} variant="striped" size={"sm"} colorScheme={`cyan`}>
            <Thead>
                {headerGroups.map((headerGroup) => (
                    <Tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <Th
                                {...column.getHeaderProps()}
                                whiteSpace="nowrap"
                                borderLeftWidth="1px"
                                borderLeftColor={`gray.200`}
                                borderRightWidth="1px"
                                borderRightColor={`gray.200`}
                            >
                                {column.render("Header") as any}
                            </Th>
                        ))}
                    </Tr>
                ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <Tr {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                                return (
                                    <Td
                                        fontSize={14}
                                        width="40px"
                                        whiteSpace="nowrap"
                                        borderLeftWidth="1px"
                                        borderLeftColor={`gray.200`}
                                        borderRightWidth="1px"
                                        borderRightColor={`gray.200`}
                                        {...cell.getCellProps()}
                                    >
                                        {cell.render("Cell") as any}
                                    </Td>
                                );
                            })}
                        </Tr>
                    );
                })}
            </Tbody>
            <Tfoot>
                {footerGroups.map((footerGroup) => (
                    <Tr {...footerGroup.getFooterGroupProps()}>
                        {footerGroup.headers.map((column) => (
                            <Td
                                {...column.getFooterProps()}
                                whiteSpace="nowrap"
                                borderLeftWidth="1px"
                                borderLeftColor={`gray.200`}
                                borderRightWidth="1px"
                                borderRightColor={`gray.200`}
                            >
                                {column.render("Footer") as any}
                            </Td>
                        ))}
                    </Tr>
                ))}
            </Tfoot>
        </ChakraTable>
    );
}
