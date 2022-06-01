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

import {
    Container,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Select,
    FormErrorMessage,
    Button,
    Text,
    useToast,
    Box,
    Stack,
    Flex,
    Skeleton,
    SkeletonText,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    VStack,
} from "@chakra-ui/react";
import { Formik, Form, Field, FieldInputProps, FormikProps } from "formik";
import { NextPage } from "next";
import axios from "axios";
import {
    FormikCreateBarangModel,
    FormikCreateDemandBarang,
} from "@/server/models/inventories/master/dto/item.schema";
import { buildServerSideProps } from "@/client/ssr/buildServerSideProps";
import { useQuery, UseQueryResult } from "react-query";
import { useAppDispatch } from "@/client/hooks/useAppDispatch";
import { useAppSelector } from "@/client/hooks/useAppSelector";
import { RootState } from "@/client/redux/store";
import { setStatus } from "@/client/redux/features/statusSlice";

type PageProps = {};

const InventoryDemand: NextPage<PageProps> = () => {
    const kategoryQuery = useQuery("inventoryDemandCategoryData", () =>
        fetch("http://localhost:3000/api/data/inventory/demand/kategori/all").then((res) => res.json())
    );

    const barangQuery = useQuery("inventoryDemandBarangData", () =>
        fetch("http://localhost:3000/api/data/inventory/demand/barang/all").then((res) => res.json())
    );
    const status = useAppSelector((state: RootState) => state.status.value);
    const dispatch = useAppDispatch();

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

    return (
        <Container mt={8} maxW={`container.xl`}>
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
                                <Heading>Kategori: {item.kategori}</Heading>
                                <Text>Username: {item.username}</Text>
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
                                <Heading>Barang: {item.barang}</Heading>
                                <Text>Satuan: {item.satuan}</Text>
                            </Box>
                        ))
                    )}
                </Stack>
                <Stack spacing={8} mx={8}>
                    <VStack>
                        <Menu>
                            <MenuButton as={Button}>Filters</MenuButton>
                            <MenuList>
                                <MenuItem onClick={() => dispatch(setStatus(4))}>Semua</MenuItem>
                                <MenuItem onClick={() => dispatch(setStatus(0))}>Belum Direspon</MenuItem>
                                <MenuItem onClick={() => dispatch(setStatus(1))}>Diterima</MenuItem>
                                <MenuItem onClick={() => dispatch(setStatus(2))}>Ditolak</MenuItem>
                            </MenuList>
                        </Menu>
                        <Button>Create</Button>
                    </VStack>
                </Stack>
            </Flex>
        </Container>
    );
};
export default InventoryDemand;
