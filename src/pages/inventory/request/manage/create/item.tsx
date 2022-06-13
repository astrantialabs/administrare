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
import { Stack, Heading, FormControl, FormLabel, Input, Box, List, ListItem, FormErrorMessage, Button, Text, useToast } from "@chakra-ui/react";
import { FormikValidatorBase, IsNotEmpty } from "formik-class-validator";
import { Form, Formik, Field, FormikHelpers, FieldInputProps, FormikProps, useFormikContext, useField, FieldHookConfig } from "formik";
import { useDebounce, useDebouncedCallback } from "use-debounce";

import Sidebar from "@/components/Sidebar";
import { InputAutoComplete } from "@/components/InputAutoComplete";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import { useEffect } from "react";
import { slugify } from "@/shared/utils/util";
import { useMutation } from "react-query";
import axios from "axios";

export interface InventoryDemandManageItemParameter {
    username: string;
    total: number;
    deskripsi: string;
    search?: string;
    result?: string;
}

export class InventoryRequestManageCreateItemValidationModel extends FormikValidatorBase implements InventoryDemandManageItemParameter {
    @IsNotEmpty({ message: "Username tidak boleh kosong!" })
    username: string;

    @IsNotEmpty({ message: "Total barang tidak boleh kosong!" })
    total: number;

    @IsNotEmpty({ message: "Deskripsi barang tidak boleh kosong!" })
    deskripsi: string;

    search: string;
    result: string;
}

const InventoryRequestManageCreateItem: NextPage = () => {
    const toast = useToast();

    const addComment = useMutation((newComment: string) => axiosInstance(`/__api/data/inventory/master/table/kategori/all`));

    const MyField = (props: any) => {
        const {
            values: { search },
            touched,
            setFieldValue,
        }: any = useFormikContext();
        const [field, meta] = useField(props);
        let response_data: any[] = [];

        const debounced = useDebouncedCallback(() => {
            if (search) {
                setFieldValue(props.name, "Mencari..");

                axiosInstance
                    .get(`/__api/data/inventory/master/search/barang/${slugify(search)}`)
                    .then((res) => {
                        setFieldValue(props.name, "test");
                        response_data = res.data;
                    })
                    .catch((err) => {
                        setFieldValue(props.name, err.message);
                        console.log(err);
                    });
            }
        }, 800);

        useEffect(() => {
            debounced();
        }, [search]);

        return (
            <Box pb={4} mb={4}>
                <List bg="white" borderRadius="4px" border="1px solid rgba(0,0,0,0.1)" boxShadow="6px 5px 8px rgba(0,50,30,0.02)">
                    <ListItem>
                        <Text padding={2}>Lorem ipsum dolor sit.</Text>
                    </ListItem>
                    <ListItem>
                        <Text padding={2}>Lorem ipsum dolor sit.</Text>
                    </ListItem>
                    <ListItem>
                        <Text padding={2}>Lorem ipsum dolor sit.</Text>
                    </ListItem>
                </List>
            </Box>
            // <FormControl mb={4} isInvalid={meta.touched && !!meta.error}>
            //     <FormLabel htmlFor="result">Result</FormLabel>
            //     <Input readOnly={true} {...field} {...props} />
            //     <FormErrorMessage>{meta.error}</FormErrorMessage>
            // </FormControl>
        );
    };

    const InventoryRequestManageCreateItemSubmit = (
        values: InventoryRequestManageCreateItemValidationModel,
        actions: FormikHelpers<InventoryRequestManageCreateItemValidationModel>
    ) => {
        actions.setSubmitting(true);

        const payload: InventoryDemandManageItemParameter = {
            username: values.username,
            total: values.total,
            deskripsi: values.deskripsi,
        };

        new Promise<void>((resolve) => {
            setTimeout(() => {
                axiosInstance
                    .post("__api/data/inventory/request/new/barang", payload)
                    .then(() => {
                        toast({
                            title: "Barang berhasil ditambahkan!",
                            description: "Barang baru berhasil ditambahkan ke dalam database.",
                            status: "success",
                            position: "bottom-right",
                            duration: 5000,
                            isClosable: true,
                        });
                        actions.setSubmitting(false);
                        resolve();
                    })
                    .catch(() => {
                        toast({
                            title: "Barang gagal ditambahkan!",
                            description: "Barang baru gagal ditambahkan ke dalam database.",
                            status: "error",
                            position: "bottom-right",
                            duration: 5000,
                            isClosable: true,
                        });
                        actions.setSubmitting(false);
                        resolve();
                    });
            }, 1000);
        });
    };

    return (
        <Sidebar type="inventory">
            <Stack spacing={8} marginY={8} marginX={8}>
                <Heading fontSize="xl">Barang</Heading>
                <Formik
                    initialValues={new InventoryRequestManageCreateItemValidationModel()}
                    validate={InventoryRequestManageCreateItemValidationModel.createValidator()}
                    onSubmit={InventoryRequestManageCreateItemSubmit}
                >
                    {(props: FormikProps<InventoryRequestManageCreateItemValidationModel>) => (
                        <Form>
                            <InputAutoComplete />
                            <Field name="username">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryDemandManageItemParameter> }) => (
                                    <FormControl mb={4}>
                                        <FormLabel htmlFor="username" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Username
                                        </FormLabel>
                                        <Input {...field} disabled={props.isSubmitting} id="username" placeholder="Username disini.." />
                                        <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>

                            {/* <Field name="search">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryDemandManageItemParameter> }) => (
                                    <FormControl mb={4}>
                                        <FormLabel htmlFor="search" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Search
                                        </FormLabel>
                                        <Input {...field} disabled={props.isSubmitting} id="search" placeholder="Search barang disini.." />
                                        <FormErrorMessage>{form.errors.search}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <MyField name="result" /> */}
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
    );
};

export default InventoryRequestManageCreateItem;
