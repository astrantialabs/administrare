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

/**
 * ANCHOR[epic=inventory demand] - item create
 */

import { NextPage } from "next";
import { Stack, Heading, FormControl, FormLabel, Input, FormErrorMessage, Button, useToast } from "@chakra-ui/react";
import { FormikValidatorBase, IsNotEmpty } from "formik-class-validator";
import { Form, Formik, Field, FormikHelpers, FieldInputProps, FormikProps } from "formik";

import Sidebar from "@/components/Sidebar";
import { axiosInstance } from "@/shared/utils/axiosInstance";

export interface InventoryDemandManageItemParameter {
    username: string;
    kategori_id: string;
    barang: string;
    satuan: string;
}

export class InventoryDemandManageCreateItemValidationModel extends FormikValidatorBase implements InventoryDemandManageItemParameter {
    @IsNotEmpty({ message: "Username tidak boleh kosong!" })
    username: string;

    kategori_id: string;

    @IsNotEmpty({ message: "Nama barang tidak boleh kosong!" })
    barang: string;

    @IsNotEmpty({ message: "Satuan barang tidak boleh kosong!" })
    satuan: string;
}

const InventoryDemandManageCreateItem: NextPage = () => {
    const toast = useToast();

    const InventoryDemandManageCreateItemSubmit = (
        values: InventoryDemandManageCreateItemValidationModel,
        actions: FormikHelpers<InventoryDemandManageCreateItemValidationModel>
    ) => {
        actions.setSubmitting(true);

        const payload: InventoryDemandManageItemParameter = {
            kategori_id: values.kategori_id,
            username: values.username,
            barang: values.barang,
            satuan: values.satuan,
        };

        new Promise<void>((resolve) => {
            setTimeout(() => {
                axiosInstance
                    .post("__api/data/inventory/demand/new/barang", payload)
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
                                            Username
                                        </FormLabel>
                                        <Input {...field} disabled={props.isSubmitting} id="username" placeholder="Username disini.." />
                                        <FormErrorMessage>{form.errors.username}</FormErrorMessage>
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
                            <Field name="kategori_id">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryDemandManageItemParameter> }) => (
                                    <FormControl my={4}>
                                        <FormLabel htmlFor="kategori_id" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Kategori
                                        </FormLabel>
                                        <FormErrorMessage>{form.errors.kategori_id}</FormErrorMessage>
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
