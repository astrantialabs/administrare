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
import { Flex, Box, Heading, Text, Button, Stack, Menu, MenuButton, MenuItem, MenuList, VStack, Spacer, LinkOverlay } from "@chakra-ui/react";
import { useQuery, UseQueryResult } from "react-query";
import dayjs from "dayjs";
import { Stat, StatLabel, StatNumber, StatGroup, Link } from "@chakra-ui/react";

import {
    InventoryDemandCategories,
    InventoryDemandCategory,
    InventoryDemandItem,
    InventoryDemandItems,
    useInventoryDemandCategoriesQuery,
    useInventoryDemandItemsQuery,
} from "@/client/queries/inventory-demand.query";
import { useAppDispatch } from "@/client/hooks/useAppDispatch";
import { useAppSelector } from "@/client/hooks/useAppSelector";
import { RootState } from "@/client/redux/store";
import { setStatus } from "@/client/redux/features/statusSlice";
import Sidebar from "@/components/Sidebar";
import { BASE_DOMAIN } from "@/shared/typings/constants";
import axios from "axios";
import { currentDate } from "@/shared/utils/util";

export const BoxStatusBackgroundSwitch = (str: string | number): string =>
    ({
        "0": "gray.300",
        "1": "green.300",
        "2": "red.300",
    }[str] || "");

export const QueryDataFilter = <T extends unknown[]>(status: number, query: UseQueryResult<T, unknown>): any[] => {
    const current = currentDate();
    const currentDateObject = new Date(current);

    const data = query.data.sort((a: any, b: any) => {
        const aDate = new Date(a.created_at);
        const bDate = new Date(b.created_at);
        return bDate.getTime() - aDate.getTime();
    });

    switch (status) {
        case 0:
            query.refetch();
            return data.filter((item: any) => item.status === status);
        case 1:
            query.refetch();
            return data.filter((item: any) => item.status === status);
        case 2:
            query.refetch();
            return data.filter((item: any) => item.status === status);
        default:
            return query.data;
    }
};

export const QueryDataFilterCustom = (kategori_id: number, query: UseQueryResult<InventoryDemandCategories, unknown>): void => {
    console.log(query.data.filter((item: any) => item.id === kategori_id));
};

export const convertDate = (date: string) => {
    return dayjs(date).format("DD MMM HH:mm:ss");
};

export const ConvertDate = (date: string) => {
    return dayjs(date).format("DD MMM HH:mm:ss");
};

const InventoryDemandMain: NextPage = () => {
    const status = useAppSelector((state: RootState) => state.status.value);
    const dispatch = useAppDispatch();

    const categories = useInventoryDemandCategoriesQuery();
    const items = useInventoryDemandItemsQuery();

    const userQuery = useQuery("userQuery", () => axios.get(`${BASE_DOMAIN}__api/user/me`, { withCredentials: true }).then((res) => res.data), {
        refetchOnMount: false,
        retry: false,
        retryDelay: 10000,
    });

    return (
        <Sidebar type="inventory">
            <Heading>Inventaris: Pengajuan</Heading>
            {userQuery.isLoading ? (
                <>
                    <Text fontSize="xs">Loading user data..</Text>
                </>
            ) : (
                <>
                    {userQuery.isError ? (
                        <></>
                    ) : (
                        <>
                            {userQuery.data.permissionLevel === "ADMINISTRATOR" || userQuery.data.permissionLevel === "SUPERADMINISTRATOR" ? (
                                <>
                                    <Button marginBottom={8}>
                                        <LinkOverlay href="/inventory/demand/manage">Manajemen</LinkOverlay>
                                    </Button>
                                </>
                            ) : (
                                <></>
                            )}
                        </>
                    )}
                </>
            )}
            <Flex flexDirection={[`column`, `row`, `row`]}>
                <Stack spacing={8} marginY={8} marginX={8}>
                    <Heading fontSize="xl">Kategori</Heading>
                    {categories.isLoading ? (
                        <Text>Loading...</Text>
                    ) : (
                        QueryDataFilter<InventoryDemandCategories>(status, categories).map((category: InventoryDemandCategory) => (
                            <Stack key={category.id} spacing={4}>
                                <Box rounded={4} padding={"8px"} background={BoxStatusBackgroundSwitch(category.status)}>
                                    <Flex flexGrow={1}>
                                        <Box flexGrow={1} marginRight={8}>
                                            <Heading fontSize="small">{category.username}</Heading>
                                            <Text fontSize={8} marginBottom={4}>
                                                dibuat {ConvertDate(category.created_at)} - direspon{" "}
                                                {typeof ConvertDate(category.responded_at) === null ? "belum" : ConvertDate(category.responded_at)}
                                            </Text>
                                            <StatGroup marginTop={2}>
                                                <Stat marginRight={8}>
                                                    <StatLabel>Kategori</StatLabel>
                                                    <StatNumber fontSize="14px" w="250px" maxW="250px">
                                                        {category.kategori}
                                                    </StatNumber>
                                                </Stat>
                                            </StatGroup>
                                        </Box>
                                    </Flex>
                                </Box>
                            </Stack>
                        ))
                    )}
                </Stack>
                <Stack spacing={8} marginY={8} marginX={8}>
                    <Heading fontSize="xl">Barang</Heading>
                    {items.isLoading ? (
                        <Text>Loading...</Text>
                    ) : (
                        QueryDataFilter<InventoryDemandItems>(status, items).map((item: InventoryDemandItem) => (
                            <Stack key={item.id} spacing={4}>
                                <Box rounded={4} padding={"8px"} background={BoxStatusBackgroundSwitch(item.status)}>
                                    <Flex>
                                        <Box flexGrow={1} marginRight={4}>
                                            <Heading fontSize="small">
                                                {item.username} untuk kategori {item.kategori_name}
                                            </Heading>
                                            <Text fontSize={8} marginBottom={4}>
                                                dibuat {ConvertDate(item.created_at)} - direspon{" "}
                                                {typeof ConvertDate(item.responded_at) === null ? "belum" : ConvertDate(item.responded_at)}
                                            </Text>
                                            <StatGroup marginTop={2}>
                                                <Stat marginRight={8}>
                                                    <StatLabel>Barang</StatLabel>
                                                    <StatNumber fontSize="14px" w="125px" maxW="250px">
                                                        {item.barang}
                                                    </StatNumber>
                                                </Stat>

                                                <Stat marginRight={8}>
                                                    <StatLabel>Satuan</StatLabel>
                                                    <StatNumber fontSize="14px" w="125px" maxW="250px">
                                                        {item.satuan}
                                                    </StatNumber>
                                                </Stat>
                                            </StatGroup>
                                        </Box>
                                    </Flex>
                                </Box>
                            </Stack>
                        ))
                    )}
                </Stack>
                <Spacer />
                <Stack spacing={8} marginY={8} marginX={8}>
                    <VStack>
                        <Menu>
                            <MenuButton as={Button} width="150px">
                                Filter Data
                            </MenuButton>
                            <MenuList>
                                <MenuItem onClick={() => dispatch(setStatus(3))}>Semua</MenuItem>
                                <MenuItem onClick={() => dispatch(setStatus(0))}>Belum Direspon</MenuItem>
                                <MenuItem onClick={() => dispatch(setStatus(1))}>Diterima</MenuItem>
                                <MenuItem onClick={() => dispatch(setStatus(2))}>Ditolak</MenuItem>
                            </MenuList>
                        </Menu>
                        <Button width="150px">
                            <Link href="/inventory/demand/create/kategori">Bikin Kategori</Link>
                        </Button>
                        <Button width="150px">
                            <Link href="/inventory/demand/create/barang">Bikin Barang</Link>
                        </Button>
                    </VStack>
                </Stack>
            </Flex>
        </Sidebar>
    );
};

export default InventoryDemandMain;
