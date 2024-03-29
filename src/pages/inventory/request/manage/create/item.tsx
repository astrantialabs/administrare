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
import Head from "next/head";
import { Stack, Heading, FormControl, FormLabel, Input, Box, List, ListItem, FormErrorMessage, Button, Text, useToast } from "@chakra-ui/react";
import { FormikValidatorBase, IsNotEmpty, IsOptional } from "formik-class-validator";
import { Form, Formik, Field, FormikHelpers, FieldInputProps, FormikProps } from "formik";
import Downshift from "downshift";

import Sidebar from "@/components/Sidebar";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import { useState } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { matchSorter } from "match-sorter";

export interface InventoryDemandManageItemParameter {
    username: string;
    total: number;
    deskripsi: string;
    search: string;
}

export class InventoryRequestManageCreateItemValidationModel extends FormikValidatorBase implements InventoryDemandManageItemParameter {
    @IsNotEmpty({ message: "Username tidak boleh kosong!" })
    username: string = "";

    @IsNotEmpty({ message: "Total barang tidak boleh kosong!" })
    total: number = 0;

    @IsOptional()
    deskripsi: string = "";

    search: string = "";
}

const InventoryRequestManageCreateItem: NextPage = () => {
    const toast = useToast();

    const [selection, setSelection] = useState<any>("n/a");
    const [category_id, setCategoryId] = useState<any>("n/a");
    const [item_id, setItem] = useState<any>("n/a");

    const fetchInventoryBarangAll = async (): Promise<any> => {
        const response = await axiosInstance.get("__api/data/inventory/master/search/barang/all");
        return response.data;
    };
    const useInventoryBarangAll = () => useQuery(["inventory-barang-all"], () => fetchInventoryBarangAll());
    let items_query: UseQueryResult<any[], unknown> = useInventoryBarangAll();

    const InputAutoComplete = ({ formikFields, formContext }: { formikFields: any; formContext: any }) => {
        let values: { value: string; item_name: string; category_name: string }[] = [];

        if (!items_query.isLoading) {
            items_query.data.map((item) => {
                values.push({
                    value: `${item.item_name} - ${item.item_unit} - ${item.category_name} - Sisa: ${item.item_saldo_remainder}`,
                    item_name: item.item_id,
                    category_name: item.category_id,
                });
            });
        }

        return (
            <Downshift
                onChange={(selection: any) => {
                    setSelection(selection.value), setCategoryId(selection.category_name), setItem(selection.item_name);
                }}
                itemToString={(item) => (item ? item.value : "")}
            >
                {({ getInputProps, getItemProps, getMenuProps, getLabelProps, getToggleButtonProps, inputValue, isOpen, getRootProps }: any) => (
                    <FormControl mb={4}>
                        <FormLabel {...getLabelProps()} fontWeight={`medium`} color={`blackAlpha.700`}>
                            Cari
                        </FormLabel>
                        <Stack
                            direction="row"
                            {...getRootProps(
                                {
                                    refKey: "",
                                },
                                { suppressRefError: true }
                            )}
                        >
                            <Input {...getInputProps()} />
                            <Button {...getToggleButtonProps()} aria-label={"toggle menu"}>
                                &#8595;
                            </Button>
                        </Stack>
                        <Box pb={4} mb={4}>
                            <List {...getMenuProps()} bg="white">
                                {items_query.isLoading ? (
                                    <ListItem marginTop={2} borderTop="1px solid rgba(0,0,0,0.1)" borderBottom="1px solid rgba(0,0,0,0.1)">
                                        <Text padding={2}>Loading form data...</Text>
                                    </ListItem>
                                ) : (
                                    isOpen &&
                                    matchSorter(values, inputValue, {
                                        keys: ["value", "item_name", "category_name"],
                                    }).map((item, index) => (
                                        <ListItem
                                            key={index}
                                            {...getItemProps({ item })}
                                            borderTop="1px solid rgba(0,0,0,0.1)"
                                            borderBottom="1px solid rgba(0,0,0,0.1)"
                                        >
                                            <Text padding={2}>{item.value}</Text>
                                        </ListItem>
                                    ))
                                )}
                            </List>
                        </Box>
                    </FormControl>
                )}
            </Downshift>
        );
    };

    const InventoryRequestManageCreateItemSubmit = (
        values: InventoryRequestManageCreateItemValidationModel,
        actions: FormikHelpers<InventoryRequestManageCreateItemValidationModel>
    ) => {
        actions.setSubmitting(true);

        const payload = {
            kategori_id: category_id,
            barang_id: item_id,
            username: values.username,
            total: parseInt(values.total as unknown as string),
            deskripsi: values.deskripsi,
        };

        new Promise<void>((resolve) => {
            setTimeout(() => {
                axiosInstance
                    .post("__api/data/inventory/request/new/barang", payload)
                    .then((response) => {
                        if (response.data.success === true) {
                            toast({
                                title: "Barang berhasil ditambahkan!",
                                description: response.data.message,
                                status: "success",
                                position: "bottom-right",
                                duration: 5000,
                                isClosable: true,
                            });

                            items_query.refetch();
                            actions.setSubmitting(false);
                            actions.resetForm();
                            setSelection("");
                            setCategoryId("");
                            setItem("");
                            resolve();
                            window.location.reload();
                        }
                    })
                    .catch((error) => {
                        console.log(error);

                        if (error.response) {
                            if (error.response.data.success === false) {
                                toast({
                                    title: "Barang gagal ditambahkan!",
                                    description: error.response.data.message,
                                    status: "error",
                                    position: "bottom-right",
                                    duration: 5000,
                                    isClosable: true,
                                });
                            }
                        } else {
                            toast({
                                title: "Barang gagal ditambahkan!",
                                description: "Barang baru gagal ditambahkan ke dalam database.",
                                status: "error",
                                position: "bottom-right",
                                duration: 5000,
                                isClosable: true,
                            });
                        }

                        actions.setSubmitting(false);
                        resolve();
                    });
            }, 1000);
        });
    };

    return (
        <>
            <Head>
                <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
                <meta http-equiv="Pragma" content="no-cache" />
                <meta http-equiv="Expires" content="-1" />
            </Head>
            <Sidebar type="inventory">
                <Heading>Inventaris: Permintaan Barang</Heading>
                <Stack spacing={8} marginY={8} marginX={8}>
                    <Heading fontSize="xl">Barang</Heading>
                    <Formik
                        initialValues={new InventoryRequestManageCreateItemValidationModel()}
                        validate={InventoryRequestManageCreateItemValidationModel.createValidator()}
                        onSubmit={InventoryRequestManageCreateItemSubmit}
                        enableReinitialize={true}
                    >
                        {(props: FormikProps<InventoryRequestManageCreateItemValidationModel>) => (
                            <Form>
                                <Field name="username">
                                    {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryDemandManageItemParameter> }) => (
                                        <FormControl mb={4}>
                                            <FormLabel htmlFor="username" fontWeight={`medium`} color={`blackAlpha.700`}>
                                                Nama
                                            </FormLabel>
                                            <Input {...field} disabled={props.isSubmitting} id="username" placeholder="Nama disini.." />
                                            <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>

                                <InputAutoComplete formikFields={undefined} formContext={undefined} />

                                <Field name="search">
                                    {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryDemandManageItemParameter> }) => (
                                        <FormControl mb={4}>
                                            <FormLabel htmlFor="deskripsi" fontWeight={`medium`} color={`blackAlpha.700`}>
                                                Hasil Pencarian
                                            </FormLabel>
                                            <Input {...field} disabled={props.isSubmitting} id="search" name="search" value={selection} />
                                            <FormErrorMessage>{form.errors.deskripsi}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>

                                <Field name="total">
                                    {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryDemandManageItemParameter> }) => (
                                        <FormControl mb={4}>
                                            <FormLabel htmlFor="total" fontWeight={`medium`} color={`blackAlpha.700`}>
                                                Total
                                            </FormLabel>
                                            <Input {...field} disabled={props.isSubmitting} id="total" placeholder="Total barang disini.." />
                                            <FormErrorMessage>{form.errors.total}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>
                                <Field name="deskripsi">
                                    {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryDemandManageItemParameter> }) => (
                                        <FormControl mb={4}>
                                            <FormLabel htmlFor="deskripsi" fontWeight={`medium`} color={`blackAlpha.700`}>
                                                Deskripsi
                                            </FormLabel>
                                            <Input {...field} disabled={props.isSubmitting} id="deskripsi" placeholder="Deskripsi barang disini.." />
                                            <FormErrorMessage>{form.errors.deskripsi}</FormErrorMessage>
                                        </FormControl>
                                    )}
                                </Field>

                                <Button mt={8} colorScheme="teal" isLoading={props.isSubmitting} disabled={props.isSubmitting} type="submit">
                                    Kirimkan
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Stack>
            </Sidebar>
        </>
    );
};

export default InventoryRequestManageCreateItem;
