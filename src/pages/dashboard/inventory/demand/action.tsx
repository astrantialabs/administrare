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
import { useAppDispatch } from "@/client/hooks/useAppDispatch";
import { useAppSelector } from "@/client/hooks/useAppSelector";
import { RootState } from "@/client/redux/store";
import { useQuery, UseQueryResult } from "react-query";
import axios from "axios";
import { setStatus } from "@/client/redux/features/statusSlice";
import {
    Flex,
    Stack,
    Heading,
    Box,
    SkeletonText,
    VStack,
    Text,
    Menu,
    MenuButton,
    Button,
    MenuList,
    MenuItem,
} from "@chakra-ui/react";

import dayjs from "dayjs";

const DashboardInventoryDemandAction: NextPage = () => {
    const status = useAppSelector((state: RootState) => state.status.value);
    const dispatch = useAppDispatch();

    const kategoryQuery = useQuery("inventoryDemandCategoryData", () =>
        axios
            .get("http://localhost:3000/__api/data/inventory/demand/get/kategori/all", { withCredentials: true })
            .then((response) => response.data)
    );

    const barangQuery = useQuery("inventoryDemandBarangData", () =>
        axios
            .get("http://localhost:3000/__api/data/inventory/demand/get/barang/all", { withCredentials: true })
            .then((response) => response.data)
    );

    const Switch = (str: string | number) =>
        ({
            "0": "gray.300",
            "1": "green.300",
            "2": "red.300",
        }[str] || "");

    function dataFilter(status: number, query: UseQueryResult<any, unknown>): any[] {
        switch (status) {
            case 0:
                query.refetch();
                return query.data.filter((item: any) => item.status === status);
            case 1:
                query.refetch();
                return query.data.filter((item: any) => item.status === status);
            case 2:
                query.refetch();
                return query.data.filter((item: any) => item.status === status);
            default:
                return query.data;
        }
    }

    // convert string to Date
    const convertDate = (date: string) => {
        return dayjs(date).format("DD-MMM-YYYY HH:mm:ss");
    };

    return (
        <Sidebar type="inventory">
            <Flex flexDirection={[`column`, `row`, `row`]}>
                <Stack spacing={8} mx={8}>
                    <Heading>Kategori</Heading>
                    {kategoryQuery.isLoading ? (
                        <Box rounded={8} padding={8}>
                            <SkeletonText noOfLines={1}></SkeletonText>
                            <SkeletonText noOfLines={4}></SkeletonText>
                        </Box>
                    ) : (
                        dataFilter(status, kategoryQuery).map((item: any) => (
                            <Box rounded={8} padding={8} bg={Switch(item.status.toString())} maxW={`440px`}>
                                <Heading fontSize={`md`}>Kategori {item.kategori}</Heading>
                                <Text fontSize={`16px`} mb={6}>
                                    Dari {item.username}
                                </Text>
                                <Text fontSize={`14px`}>Dibikin {convertDate(item.created_at)}</Text>
                            </Box>
                        ))
                    )}
                </Stack>
                <Stack spacing={8} mx={8}>
                    <Heading>Barang</Heading>
                    {barangQuery.isLoading ? (
                        <Box rounded={8} padding={8}>
                            <SkeletonText noOfLines={1}></SkeletonText>
                            <SkeletonText noOfLines={4}></SkeletonText>
                        </Box>
                    ) : (
                        dataFilter(status, barangQuery).map((item: any) => (
                            <Box rounded={8} padding={8} bg={Switch(item.status.toString())} maxW={`440px`}>
                                <Heading fontSize={`md`}>Barang {item.barang}</Heading>
                                <Text fontSize={`18px`} mb={6}>
                                    {item.satuan}
                                </Text>
                                <Text fontSize={`16px`} mb={6}>
                                    Dari {item.username}
                                </Text>
                                <Text fontSize={`14px`}>Dibikin {convertDate(item.created_at)}</Text>
                            </Box>
                        ))
                    )}
                </Stack>
                <Stack spacing={8} mx={8}>
                    <VStack>
                        <Menu>
                            <MenuButton as={Button}>Filters</MenuButton>
                            <MenuList>
                                <MenuItem onClick={() => dispatch(setStatus(3))}>Semua</MenuItem>
                                <MenuItem onClick={() => dispatch(setStatus(0))}>Belum Direspon</MenuItem>
                                <MenuItem onClick={() => dispatch(setStatus(1))}>Diterima</MenuItem>
                                <MenuItem onClick={() => dispatch(setStatus(2))}>Ditolak</MenuItem>
                            </MenuList>
                        </Menu>
                        <Button>Create</Button>
                    </VStack>
                </Stack>
            </Flex>
        </Sidebar>
    );
};

export default DashboardInventoryDemandAction;
