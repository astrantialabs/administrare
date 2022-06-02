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
} from "@chakra-ui/react";
import { Formik, Form, Field, FieldInputProps, FormikProps } from "formik";
import axios from "axios";

import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import { MasterInventoryKategoriCreateFormModel } from "@/server/models/inventories/master/validations/kategori.validation";
import { ParameterMasterInventoryCreateCategoryDto } from "@/server/models/inventories/master/dto/category.schema";
import { axiosInstance } from "@/shared/utils/axiosInstance";

const DashboardInventoryCreateKategori: NextPage = () => {
    const toast = useToast();

    return (
        <Sidebar type="inventory">
            <Heading as={`h1`} size={`xl`} paddingBottom={`44px`} marginBottom={`24px`}>
                Bikin sebuah barang baru.
            </Heading>
            <Formik
                initialValues={new MasterInventoryKategoriCreateFormModel()}
                validate={MasterInventoryKategoriCreateFormModel.createValidator()}
                onSubmit={async (values, action) => {
                    const payload: ParameterMasterInventoryCreateCategoryDto = {
                        kategori: values.kategori,
                        tahun: 2022,
                    };

                    action.setSubmitting(true);

                    setTimeout(() => {
                        axiosInstance
                            .post(`/__api/data/inventory/master/create/kategori`, payload, {
                                withCredentials: true,
                            })
                            .then((res) => {
                                toast({
                                    position: "top-right",
                                    title: "Category created.",
                                    description: `Kategori bernama ${values.kategori.toUpperCase()} berhasil dibuat.`,
                                    status: "success",
                                    duration: 9000,
                                    isClosable: true,
                                });

                                action.setSubmitting(false);
                                action.resetForm();
                                action.setStatus({ success: true });
                            })
                            .catch(() => {
                                toast({
                                    position: "top-right",
                                    title: "Category not created.",
                                    description: `Kategori bernama ${values.kategori.toUpperCase()} tidak berhasil dibuat.`,
                                    status: "error",
                                    duration: 9000,
                                    isClosable: true,
                                });

                                action.setSubmitting(false);
                            });
                    }, 800);
                }}
            >
                {(props) => (
                    <Form>
                        <Field name="kategori">
                            {({
                                field,
                                form,
                            }: {
                                field: FieldInputProps<string>;
                                form: FormikProps<{ kategori: string }>;
                            }) => (
                                <FormControl>
                                    <FormLabel htmlFor="kategori" fontWeight={`medium`} color={`blackAlpha.700`}>
                                        Kategori
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        disabled={props.isSubmitting}
                                        id="kategori"
                                        placeholder="Nama kategori disini.."
                                    />
                                    <FormErrorMessage>{form.errors.kategori}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Button
                            mt={8}
                            colorScheme="teal"
                            isLoading={props.isSubmitting}
                            type="submit"
                            disabled={props.isSubmitting}
                        >
                            Kirimkan
                        </Button>
                    </Form>
                )}
            </Formik>
        </Sidebar>
    );
};

export default DashboardInventoryCreateKategori;
