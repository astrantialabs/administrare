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
import { Flex, Box, Heading, Text, Button, Stack, Menu, MenuButton, MenuItem, MenuList, VStack, Spacer, Link } from "@chakra-ui/react";
import { UseQueryResult } from "react-query";
import dayjs from "dayjs";
import { Stat, StatLabel, StatNumber, StatGroup } from "@chakra-ui/react";

import {
    InventoryDemandCategories,
    InventoryDemandCategory,
    InventoryDemandItem,
    InventoryDemandItems,
    useInventoryDemandCategoriesQuery,
    useInventoryDemandItemsQuery,
} from "@/client/queries/inventory-demand.query";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import { useAppDispatch } from "@/client/hooks/useAppDispatch";
import { useAppSelector } from "@/client/hooks/useAppSelector";
import { RootState } from "@/client/redux/store";
import { setStatus } from "@/client/redux/features/statusSlice";

export const BoxStatusBackgroundSwitch = (str: string | number): string =>
    ({
        "0": "gray.300",
        "1": "green.300",
        "2": "red.300",
    }[str] || "");

export const QueryDataFilter = <T extends unknown[]>(status: number, query: UseQueryResult<T, unknown>): any[] => {
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
};

export const ConvertDate = (date: string) => {
    return dayjs(date).format("DD MMM HH:mm:ss");
};

const InventoryDemandManageMain: NextPage = () => {
    const status = useAppSelector((state: RootState) => state.status.value);
    const dispatch = useAppDispatch();

    const categories = useInventoryDemandCategoriesQuery();
    let items = useInventoryDemandItemsQuery();

    return (
        <Flex flexDirection={[`column`, `row`, `row`]}>
            <Stack spacing={8} marginY={8} marginX={8}>
                <Heading fontSize="xl">Kategori</Heading>
                {categories.isLoading ? (
                    <Text>Loading...</Text>
                ) : (
                    QueryDataFilter<InventoryDemandCategories>(status, categories).map((category: InventoryDemandCategory) => (
                        <Stack key={category.id} spacing={4}>
                            <Box rounded={4} padding={8} background={BoxStatusBackgroundSwitch(category.status)}>
                                <Flex flexGrow={1}>
                                    <Box flexGrow={1} marginRight={8}>
                                        <Heading fontSize="small">{category.username}</Heading>
                                        <Text fontSize={8} marginBottom={4}>
                                            dibuat {ConvertDate(category.created_at)}- direspon {ConvertDate(category.responded_at)}
                                        </Text>

                                        <StatGroup marginTop={2}>
                                            <Stat marginRight={8}>
                                                <StatLabel>Kategori</StatLabel>
                                                <StatNumber fontSize="large">{category.kategori}</StatNumber>
                                            </Stat>
                                        </StatGroup>
                                        <Stack direction="row" marginTop={4}>
                                            {category.status === 0 ? (
                                                <>
                                                    <Formik
                                                        initialValues={{}}
                                                        onSubmit={async (values, action) => {
                                                            action.setSubmitting(true);

                                                            await axiosInstance
                                                                .put(`__api/data/inventory/demand/response/kategori/${category.id}/status/1`)
                                                                .then(() => {
                                                                    categories.refetch();
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
                                                                    Accept
                                                                </Button>
                                                            </Form>
                                                        )}
                                                    </Formik>
                                                    <Formik
                                                        initialValues={{}}
                                                        onSubmit={async (values, action) => {
                                                            action.setSubmitting(true);

                                                            await axiosInstance
                                                                .put(`__api/data/inventory/demand/response/kategori/${category.id}/status/2`)
                                                                .then(() => {
                                                                    categories.refetch();
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
                                                                    Reject
                                                                </Button>
                                                            </Form>
                                                        )}
                                                    </Formik>
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                        </Stack>
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
                            <Box rounded={4} padding={8} background={BoxStatusBackgroundSwitch(item.status)}>
                                <Flex>
                                    <Box flexGrow={1} marginRight={4}>
                                        <Heading fontSize="small">
                                            {item.username} dari kategori {item.kategori_name}
                                        </Heading>
                                        <Text fontSize={8} marginBottom={4}>
                                            dibuat {ConvertDate(item.created_at)}- direspon {ConvertDate(item.responded_at)}
                                        </Text>
                                        <StatGroup marginTop={2}>
                                            <Stat marginRight={8}>
                                                <StatLabel>Barang</StatLabel>
                                                <StatNumber fontSize="large">{item.barang}</StatNumber>
                                            </Stat>

                                            <Stat marginRight={8}>
                                                <StatLabel>Satuan</StatLabel>
                                                <StatNumber fontSize="large">{item.satuan}</StatNumber>
                                            </Stat>
                                        </StatGroup>
                                        <Stack direction="row" marginTop={4}>
                                            {item.status === 0 ? (
                                                <>
                                                    <Formik
                                                        initialValues={{}}
                                                        onSubmit={async (values, action) => {
                                                            action.setSubmitting(true);

                                                            await axiosInstance
                                                                .put(`__api/data/inventory/demand/response/barang/${item.id}/status/1`)
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
                                                                    Accept
                                                                </Button>
                                                            </Form>
                                                        )}
                                                    </Formik>
                                                    <Formik
                                                        initialValues={{}}
                                                        onSubmit={async (values, action) => {
                                                            action.setSubmitting(true);

                                                            await axiosInstance
                                                                .put(`__api/data/inventory/demand/response/barang/${item.id}/status/2`)
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
                                                                    Reject
                                                                </Button>
                                                            </Form>
                                                        )}
                                                    </Formik>
                                                </>
                                            ) : (
                                                <></>
                                            )}
                                        </Stack>
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
                        <MenuButton as={Button}>Filters</MenuButton>
                        <MenuList>
                            <MenuItem onClick={() => dispatch(setStatus(3))}>Semua</MenuItem>
                            <MenuItem onClick={() => dispatch(setStatus(0))}>Belum Direspon</MenuItem>
                            <MenuItem onClick={() => dispatch(setStatus(1))}>Diterima</MenuItem>
                            <MenuItem onClick={() => dispatch(setStatus(2))}>Ditolak</MenuItem>
                        </MenuList>
                    </Menu>
                    <Button>
                        <Link href="/inventory/demand/manage/create/kategori">Create Kategori</Link>
                    </Button>
                    <Button>
                        <Link href="/inventory/demand/manage/create/barang">Create Barang</Link>
                    </Button>
                </VStack>
            </Stack>
        </Flex>
    );
};

export default InventoryDemandManageMain;
