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
import { Form, Formik } from "formik";
import { Flex, Box, Heading, Text, Button, Stack, Menu, MenuButton, MenuItem, MenuList, LinkOverlay, VStack, Spacer } from "@chakra-ui/react";
import { UseQueryResult } from "react-query";
import dayjs from "dayjs";
import { Stat, StatLabel, StatNumber, StatGroup, Link } from "@chakra-ui/react";

import { axiosInstance } from "@/shared/utils/axiosInstance";
import { useAppDispatch } from "@/client/hooks/useAppDispatch";
import { useAppSelector } from "@/client/hooks/useAppSelector";
import { RootState } from "@/client/redux/store";
import { setStatus } from "@/client/redux/features/statusSlice";
import { InventoryRequestItem, InventoryRequestItems, useInventoryRequestItemsQuery } from "@/client/queries/inventory-request.payload";
import Sidebar from "@/components/Sidebar";
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
    let data = query.data.filter((item: any) => new Date(item.created_at) >= currentDateObject);

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

export const convertDate = (date: string) => {
    return dayjs(date).format("DD MMM HH:mm:ss");
};

export const ConvertDate = (date: string) => {
    return dayjs(date).format("DD MMM HH:mm:ss");
};

const InventoryRequestManageMain: NextPage = () => {
    const status = useAppSelector((state: RootState) => state.status.value);
    const dispatch = useAppDispatch();

    const items = useInventoryRequestItemsQuery();

    return (
        <Sidebar type="inventory">
            <Heading>Inventaris: Permintaan</Heading>
            <Flex flexDirection={[`column`, `row`, `row`]}>
                <Stack spacing={8} marginY={8} marginX={8}>
                    <Heading fontSize="xl">Barang</Heading>
                    {items.isLoading ? (
                        <Text>Loading...</Text>
                    ) : (
                        QueryDataFilter<InventoryRequestItems>(status, items).map((item: InventoryRequestItem) => (
                            <Stack key={item.id} spacing={4}>
                                <Box rounded={4} padding="8px" background={BoxStatusBackgroundSwitch(item.status)}>
                                    <Flex flexGrow={1}>
                                        <Box flexGrow={1} marginRight={8}>
                                            <Heading fontSize="small">{item.username}</Heading>
                                            <Text fontSize={8} marginBottom={4}>
                                                dibuat {ConvertDate(item.created_at)} - direspon{" "}
                                                {typeof ConvertDate(item.responded_at) === null ? "belum" : ConvertDate(item.responded_at)}
                                            </Text>
                                            <StatGroup marginTop={2} padding={0}>
                                                <Stat marginRight={8} size="sm" padding={0}>
                                                    <StatLabel width="75px">Kategori</StatLabel>
                                                    <StatNumber fontSize="14px">{item.kategori_name}</StatNumber>
                                                </Stat>
                                                <Stat marginRight={8} width="600px" padding={0}>
                                                    <StatLabel>Barang</StatLabel>
                                                    <StatNumber fontSize="14px">{item.barang_name}</StatNumber>
                                                </Stat>
                                                <Stat marginRight={8} width="50px" padding={0}>
                                                    <StatLabel>Satuan</StatLabel>
                                                    <StatNumber fontSize="14px">{item.barang_unit}</StatNumber>
                                                </Stat>
                                                <Stat marginRight={8} width="40px" padding={0}>
                                                    <StatLabel>Total</StatLabel>
                                                    <StatNumber fontSize="14px">{item.total}</StatNumber>
                                                </Stat>
                                            </StatGroup>
                                            {item.deskripsi === "" ? (
                                                <></>
                                            ) : (
                                                <Text fontSize={10} mt={4}>
                                                    {item.deskripsi}
                                                </Text>
                                            )}
                                            {item.status === 0 ? (
                                                <>
                                                    <Stack direction="row" marginTop={4}>
                                                        <Formik
                                                            initialValues={{}}
                                                            onSubmit={async (values, action) => {
                                                                action.setSubmitting(true);

                                                                await axiosInstance
                                                                    .put(`__api/data/inventory/request/response/barang/${item.id}/status/1`)
                                                                    .then(() => {
                                                                        items.refetch();
                                                                        action.setSubmitting(false);
                                                                    })
                                                                    .catch((error) => {
                                                                        action.setSubmitting(false);
                                                                        console.log(error);
                                                                    });
                                                            }}
                                                        >
                                                            {(props) => (
                                                                <Form>
                                                                    <Button
                                                                        colorScheme="green"
                                                                        size="sm"
                                                                        isLoading={props.isSubmitting}
                                                                        type="submit"
                                                                        disabled={props.isSubmitting}
                                                                    >
                                                                        Terima
                                                                    </Button>
                                                                </Form>
                                                            )}
                                                        </Formik>
                                                        <Formik
                                                            initialValues={{}}
                                                            onSubmit={async (values, action) => {
                                                                action.setSubmitting(true);

                                                                await axiosInstance
                                                                    .put(`__api/data/inventory/request/response/barang/${item.id}/status/2`)
                                                                    .then(() => {
                                                                        items.refetch();
                                                                        action.setSubmitting(false);
                                                                    })
                                                                    .catch((error) => {
                                                                        action.setSubmitting(false);
                                                                        console.log(error);
                                                                    });
                                                            }}
                                                        >
                                                            {(props) => (
                                                                <Form>
                                                                    <Button
                                                                        colorScheme="red"
                                                                        size="sm"
                                                                        isLoading={props.isSubmitting}
                                                                        type="submit"
                                                                        disabled={props.isSubmitting}
                                                                    >
                                                                        Tolak
                                                                    </Button>
                                                                </Form>
                                                            )}
                                                        </Formik>
                                                    </Stack>
                                                </>
                                            ) : (
                                                <></>
                                            )}
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
                            <Link href="/inventory/request/create/barang">Bikin Permintaan</Link>
                        </Button>
                        <Button width="150px" marginTop={8}>
                            <LinkOverlay href="/inventory/request/download">Download Excel</LinkOverlay>
                        </Button>
                    </VStack>
                </Stack>
            </Flex>
        </Sidebar>
    );
};

export default InventoryRequestManageMain;
