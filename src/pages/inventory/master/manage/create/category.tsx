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

export interface InventoryMasterManageCreateCategoryParameter {
    kategori: string;
}

export class InventoryMasterManageCreateCategoryValidationModel extends FormikValidatorBase implements InventoryMasterManageCreateCategoryParameter {
    @IsNotEmpty({ message: "Kategori tidak boleh kosong!" })
    kategori: string;
}

const InventoryMasterManageCreateCategory: NextPage = () => {
    const toast = useToast();

    const InventoryMasterManageCreateCategorySubmit = (
        values: InventoryMasterManageCreateCategoryValidationModel,
        actions: FormikHelpers<InventoryMasterManageCreateCategoryValidationModel>
    ) => {
        actions.setSubmitting(true);

        const payload: InventoryMasterManageCreateCategoryParameter = {
            kategori: values.kategori,
        };

        new Promise<void>((resolve) => {
            setTimeout(() => {
                axiosInstance
                    .post("__api/data/inventory/master/new/kategori", payload)
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
            <Stack spacing={8} marginY={8} marginX={8}>
                <Heading fontSize="xl">Inventaris: Buat Kategori</Heading>
                <Formik
                    initialValues={new InventoryMasterManageCreateCategoryValidationModel()}
                    validate={InventoryMasterManageCreateCategoryValidationModel.createValidator()}
                    onSubmit={InventoryMasterManageCreateCategorySubmit}
                >
                    {(props: FormikProps<InventoryMasterManageCreateCategoryValidationModel>) => (
                        <Form>
                            <Field name="kategori">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryMasterManageCreateCategoryParameter> }) => (
                                    <FormControl>
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

export default InventoryMasterManageCreateCategory;
