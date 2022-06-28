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
import { Stack, Heading, FormControl, FormLabel, Input, Select, FormErrorMessage, Button, useToast } from "@chakra-ui/react";
import { FormikValidatorBase, IsNotEmpty } from "formik-class-validator";
import { Form, Formik, Field, FormikHelpers, FieldInputProps, FormikProps } from "formik";

import Sidebar from "@/components/Sidebar";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import { useTableCategories } from "@/client/hooks/useTableCategories";

export interface InventoryDemandManageItemParameter {
    kategori_id: string;
    username: string;
    barang: string;
    satuan: string;
}

export class InventoryDemandManageCreateItemValidationModel extends FormikValidatorBase implements InventoryDemandManageItemParameter {
    kategori_id: string;

    @IsNotEmpty({ message: "Username tidak boleh kosong!" })
    username: string;

    @IsNotEmpty({ message: "Nama barang tidak boleh kosong!" })
    barang: string;

    @IsNotEmpty({ message: "Satuan barang tidak boleh kosong!" })
    satuan: string;
}

const InventoryDemandManageCreateItem: NextPage = () => {
    const categories = useTableCategories();
    const toast = useToast();

    const InventoryDemandManageCreateItemSubmit = (
        values: InventoryDemandManageCreateItemValidationModel,
        actions: FormikHelpers<InventoryDemandManageCreateItemValidationModel>
    ) => {
        actions.setSubmitting(true);

        const payload: InventoryDemandManageItemParameter = {
            kategori_id: parseInt(values.kategori_id) as unknown as string,
            username: values.username,
            barang: values.barang,
            satuan: values.satuan,
        };

        new Promise<void>((resolve) => {
            setTimeout(() => {
                axiosInstance
                    .post("__api/data/inventory/demand/new/barang", payload)
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

                            actions.resetForm();
                            actions.setSubmitting(false);
                            resolve();
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
                            actions.setSubmitting(false);
                            resolve();
                        }
                    });
            }, 1000);
        });
    };

    return (
        <Sidebar type="inventory">
            <Heading>Inventaris: Pengajuan Bikin Barang</Heading>
            <Stack spacing={8} marginY={8} marginX={8}>
                <Heading fontSize="xl">Barang</Heading>
                <Formik
                    initialValues={new InventoryDemandManageCreateItemValidationModel()}
                    validate={InventoryDemandManageCreateItemValidationModel.createValidator()}
                    onSubmit={InventoryDemandManageCreateItemSubmit}
                >
                    {(props: FormikProps<InventoryDemandManageCreateItemValidationModel>) => (
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
                            <Field name="kategori_id">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryDemandManageItemParameter> }) => (
                                    <FormControl my={4}>
                                        <FormLabel htmlFor="kategori_id" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Kategori
                                        </FormLabel>
                                        <Select {...field} disabled={props.isSubmitting} id="kategori_id">
                                            {categories.isLoading ? (
                                                <option>Loading...</option>
                                            ) : (
                                                <>
                                                    <option value="">Pilih kategori</option>
                                                    {categories.data.map((category) => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </>
                                            )}
                                        </Select>
                                        <FormErrorMessage>{form.errors.kategori_id}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="barang">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryDemandManageItemParameter> }) => (
                                    <FormControl my={4}>
                                        <FormLabel htmlFor="barang" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Barang
                                        </FormLabel>
                                        <Input {...field} disabled={props.isSubmitting} id="barang" placeholder="Nama barang disini.." />
                                        <FormErrorMessage>{form.errors.barang}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="satuan">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryDemandManageItemParameter> }) => (
                                    <FormControl my={4}>
                                        <FormLabel htmlFor="satuan" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Satuan
                                        </FormLabel>
                                        <Input {...field} disabled={props.isSubmitting} id="satuan" placeholder="Satuan barang disini.." />
                                        <FormErrorMessage>{form.errors.satuan}</FormErrorMessage>
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

export default InventoryDemandManageCreateItem;
