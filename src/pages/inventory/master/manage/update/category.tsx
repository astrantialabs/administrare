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
import { MasterKategori } from "@/server/models/inventories/master/schema/master-inventory.schema";
import { buildServerSideProps } from "@/client/ssr/buildServerSideProps";
import { fetch } from "@/shared/utils/fetch";

export interface InventoryMasterManageUpdateCategoryParameter {
    kategori: string;
}

export class InventoryMasterManageUpdateCategoryValidationModel extends FormikValidatorBase implements InventoryMasterManageUpdateCategoryParameter {
    @IsNotEmpty({ message: "Kategori tidak boleh kosong!" })
    kategori: string;

    constructor(isUpdate: boolean, data: InventoryMasterManageUpdateCategoryParameter) {
        super();

        if (isUpdate) {
            this.kategori = data.kategori;
        }
    }
}

type PageQuery = {
    category_id: string;
};

type PageProps = {
    payload: MasterKategori;
    category_id: string;
};

const InventoryMasterManageUpdateCategory: NextPage<PageProps> = ({ payload, category_id }) => {
    const toast = useToast();

    const InventoryMasterManageCreateCategorySubmit = (
        values: InventoryMasterManageUpdateCategoryValidationModel,
        actions: FormikHelpers<InventoryMasterManageUpdateCategoryValidationModel>
    ) => {
        actions.setSubmitting(true);

        const payload: InventoryMasterManageUpdateCategoryParameter = {
            kategori: values.kategori,
        };

        new Promise<void>((resolve) => {
            setTimeout(() => {
                axiosInstance
                    .put(`__api/data/inventory/master/kategori/${category_id}`, payload)
                    .then((response) => {
                        if (response.data.success) {
                            toast({
                                title: "Kategori berhasil diupdate!",
                                description: response.data.message,
                                status: "success",
                                position: "bottom-right",
                                duration: 5000,
                                isClosable: true,
                            });
                        } else {
                            toast({
                                title: "Kategori gagal diupdate!",
                                description: response.data.message,
                                status: "error",
                                position: "bottom-right",
                                duration: 5000,
                                isClosable: true,
                            });
                        }
                        actions.setSubmitting(false);
                        resolve();
                    })
                    .catch(() => {
                        toast({
                            title: "Kategori gagal diupdate!",
                            description: "Kategori baru gagal diupdate ke dalam database.",
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
                <Heading fontSize="xl">Update Kategori</Heading>
                <Formik
                    initialValues={new InventoryMasterManageUpdateCategoryValidationModel(true, payload)}
                    validate={InventoryMasterManageUpdateCategoryValidationModel.createValidator()}
                    onSubmit={InventoryMasterManageCreateCategorySubmit}
                >
                    {(props: FormikProps<InventoryMasterManageUpdateCategoryValidationModel>) => (
                        <Form>
                            <Field name="kategori">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryMasterManageUpdateCategoryParameter> }) => (
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

export const getServerSideProps = buildServerSideProps<PageProps, PageQuery>(async (ctx) => {
    const kategory_id = ctx.query.category_id;

    const payload = await fetch(`/__api/data/inventory/master/kategori/${parseInt(kategory_id)}`);

    return {
        payload: payload,
        category_id: kategory_id,
    };
});

export default InventoryMasterManageUpdateCategory;
