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

/**
 * @fileoverview The inventory demand manage create item page.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import { NextPage } from "next";
import { Stack, Heading, FormControl, FormLabel, Input, FormErrorMessage, Button, useToast } from "@chakra-ui/react";
import { FormikValidatorBase, IsNotEmpty } from "formik-class-validator";
import { Form, Formik, Field, FormikHelpers, FieldInputProps, FormikProps } from "formik";

import Sidebar from "@/components/Sidebar";
import { axiosInstance } from "@/shared/utils/axiosInstance";

export interface InventoryDemandManageCreateCategoryParameter {
    kategori: string;
    username: string;
}

export class InventoryDemandManageCreateCategoryValidationModel extends FormikValidatorBase implements InventoryDemandManageCreateCategoryParameter {
    @IsNotEmpty({ message: "Username tidak boleh kosong!" })
    username: string;

    @IsNotEmpty({ message: "Kategori tidak boleh kosong!" })
    kategori: string;
}

const InventoryDemandManageCreateCategory: NextPage = () => {
    const toast = useToast();

    const InventoryDemandManageCreateCategorySubmit = (
        values: InventoryDemandManageCreateCategoryValidationModel,
        actions: FormikHelpers<InventoryDemandManageCreateCategoryValidationModel>
    ) => {
        actions.setSubmitting(true);

        const payload: InventoryDemandManageCreateCategoryParameter = {
            username: values.username,
            kategori: values.kategori,
        };

        new Promise<void>((resolve) => {
            setTimeout(() => {
                axiosInstance
                    .post("__api/data/inventory/demand/new/kategori", payload)
                    .then((response) => {
                        if (response.data.success === true) {
                            toast({
                                title: "Kategori berhasil ditambahkan!",
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
                        if (error.response) {
                            if (error.response.data.success === false) {
                                toast({
                                    title: "Kategori gagal ditambahkan!",
                                    description: error.response.data.message,
                                    status: "error",
                                    position: "bottom-right",
                                    duration: 5000,
                                    isClosable: true,
                                });
                            }
                        } else {
                            toast({
                                title: "Kategori gagal ditambahkan!",
                                description: "Kategori baru gagal ditambahkan ke dalam database.",
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
        <Sidebar type="inventory">
            <Heading>Inventory Demand</Heading>
            <Stack spacing={8} marginY={8} marginX={8}>
                <Heading fontSize="xl">Kategori</Heading>
                <Formik
                    initialValues={new InventoryDemandManageCreateCategoryValidationModel()}
                    validate={InventoryDemandManageCreateCategoryValidationModel.createValidator()}
                    onSubmit={InventoryDemandManageCreateCategorySubmit}
                >
                    {(props: FormikProps<InventoryDemandManageCreateCategoryValidationModel>) => (
                        <Form>
                            <Field name="username">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryDemandManageCreateCategoryParameter> }) => (
                                    <FormControl>
                                        <FormLabel htmlFor="username" fontWeight={`medium`} color={`blackAlpha.700`} mb={4}>
                                            Nama
                                        </FormLabel>
                                        <Input {...field} disabled={props.isSubmitting} id="username" placeholder="Nama disini.." />
                                        <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="kategori">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryDemandManageCreateCategoryParameter> }) => (
                                    <FormControl mt={4}>
                                        <FormLabel htmlFor="kategori" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Kategori
                                        </FormLabel>
                                        <Input {...field} disabled={props.isSubmitting} id="kategori" placeholder="Nama kategori disini.." />
                                        <FormErrorMessage>{form.errors.kategori}</FormErrorMessage>
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

export default InventoryDemandManageCreateCategory;
