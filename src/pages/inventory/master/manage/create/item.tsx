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
import { FormikValidatorBase, IsNotEmpty, IsOptional } from "formik-class-validator";
import { Form, Formik, Field, FormikHelpers, FieldInputProps, FormikProps } from "formik";

import Sidebar from "@/components/Sidebar";
import { axiosInstance } from "@/shared/utils/axiosInstance";
import { useTableCategories } from "@/client/hooks/useTableCategories";

export interface InventoryDemandManageItemParameter {
    kategori_id: string;
    nama: string;
    satuan: string;
    saldo_jumlah_satuan: string;
    mutasi_barang_masuk_jumlah_satuan: string;
    mutasi_barang_keluar_jumlah_satuan: string;
    harga_satuan: string;
    keterangan: string;
}

export class InventoryMasterManageCreateItemValidationModel extends FormikValidatorBase implements InventoryDemandManageItemParameter {
    @IsNotEmpty({ message: "Username tidak boleh kosong!" })
    nama: string;

    kategori_id: string;

    @IsNotEmpty({ message: "Satuan barang tidak boleh kosong!" })
    satuan: string;

    @IsNotEmpty({ message: "Saldo jumlah satuan barang tidak boleh kosong!" })
    saldo_jumlah_satuan: string;

    @IsNotEmpty({ message: "Mutasi barang masuk barang tidak boleh kosong!" })
    mutasi_barang_masuk_jumlah_satuan: string;

    @IsNotEmpty({ message: "Mutasi barang keluar barang tidak boleh kosong!" })
    mutasi_barang_keluar_jumlah_satuan: string;

    @IsNotEmpty({ message: "Harga satuan barang tidak boleh kosong!" })
    harga_satuan: string;

    @IsNotEmpty({ message: "Satuan barang tidak boleh kosong!" })
    keterangan: string;
}

const InventoryMasterManageCreateItem: NextPage = () => {
    const categories = useTableCategories();
    const toast = useToast();

    const InventoryMasterManageCreateItemSubmit = (
        values: InventoryMasterManageCreateItemValidationModel,
        actions: FormikHelpers<InventoryMasterManageCreateItemValidationModel>
    ) => {
        actions.setSubmitting(true);

        const payload: InventoryDemandManageItemParameter = {
            nama: values.nama,
            kategori_id: values.kategori_id,
            satuan: values.satuan,
            saldo_jumlah_satuan: values.saldo_jumlah_satuan,
            mutasi_barang_masuk_jumlah_satuan: values.mutasi_barang_masuk_jumlah_satuan,
            mutasi_barang_keluar_jumlah_satuan: values.mutasi_barang_keluar_jumlah_satuan,
            harga_satuan: values.harga_satuan,
            keterangan: values.keterangan,
        };

        new Promise<void>((resolve) => {
            setTimeout(() => {
                axiosInstance
                    .post("__api/data/inventory/master/new/barang", payload)
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
                    initialValues={new InventoryMasterManageCreateItemValidationModel()}
                    validate={InventoryMasterManageCreateItemValidationModel.createValidator()}
                    onSubmit={InventoryMasterManageCreateItemSubmit}
                >
                    {(props: FormikProps<InventoryMasterManageCreateItemValidationModel>) => (
                        <Form>
                            <Field name="kategori_id" as="select">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryDemandManageItemParameter> }) => (
                                    <FormControl my={4}>
                                        <FormLabel htmlFor="kategori_id" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Kategori
                                        </FormLabel>
                                        <Select {...field} disabled={props.isSubmitting} id="kategori_id">
                                            {categories.isLoading ? (
                                                <option>Loading...</option>
                                            ) : (
                                                categories.data.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))
                                            )}
                                        </Select>
                                        <FormErrorMessage>{form.errors.kategori_id}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="nama">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryDemandManageItemParameter> }) => (
                                    <FormControl mb={4}>
                                        <FormLabel htmlFor="nama" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Nama
                                        </FormLabel>
                                        <Input {...field} disabled={props.isSubmitting} id="nama" placeholder="Nama disini.." />
                                        <FormErrorMessage>{form.errors.nama}</FormErrorMessage>
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
                            <Field name="saldo_jumlah_satuan">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryDemandManageItemParameter> }) => (
                                    <FormControl my={4}>
                                        <FormLabel htmlFor="satuan" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Saldo Jumlah Satuan
                                        </FormLabel>
                                        <Input
                                            {...field}
                                            disabled={props.isSubmitting}
                                            id="saldo_jumlah_satuan"
                                            placeholder="Saldo jumlah satuan barang disini.."
                                        />
                                        <FormErrorMessage>{form.errors.saldo_jumlah_satuan}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="mutasi_barang_masuk_jumlah_satuan">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryDemandManageItemParameter> }) => (
                                    <FormControl my={4}>
                                        <FormLabel htmlFor="mutasi_barang_masuk_jumlah_satuan" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Mutasi Barang Masuk Jumlah Satuan
                                        </FormLabel>
                                        <Input
                                            {...field}
                                            disabled={props.isSubmitting}
                                            id="mutasi_barang_masuk_jumlah_satuan"
                                            placeholder="Mutasi barang masuk jumlah satuan barang disini.."
                                        />
                                        <FormErrorMessage>{form.errors.mutasi_barang_masuk_jumlah_satuan}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="mutasi_barang_keluar_jumlah_satuan">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryDemandManageItemParameter> }) => (
                                    <FormControl my={4}>
                                        <FormLabel htmlFor="satuan" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Mutasi Barang Keluar Jumlah Satuan
                                        </FormLabel>
                                        <Input
                                            {...field}
                                            disabled={props.isSubmitting}
                                            id="mutasi_barang_keluar_jumlah_satuan"
                                            placeholder="Mutasi barang keluar jumlah satuan barang disini.."
                                        />
                                        <FormErrorMessage>{form.errors.mutasi_barang_keluar_jumlah_satuan}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="harga_satuan">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryDemandManageItemParameter> }) => (
                                    <FormControl my={4}>
                                        <FormLabel htmlFor="satuan" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Harga Satuan
                                        </FormLabel>
                                        <Input {...field} disabled={props.isSubmitting} id="harga_satuan" placeholder="Harga satuan barang disini.." />
                                        <FormErrorMessage>{form.errors.harga_satuan}</FormErrorMessage>
                                    </FormControl>
                                )}
                            </Field>
                            <Field name="keterangan">
                                {({ field, form }: { field: FieldInputProps<any>; form: FormikProps<InventoryDemandManageItemParameter> }) => (
                                    <FormControl my={4}>
                                        <FormLabel htmlFor="keterangan" fontWeight={`medium`} color={`blackAlpha.700`}>
                                            Keterangan
                                        </FormLabel>
                                        <Input {...field} disabled={props.isSubmitting} id="keterangan" placeholder="Keterangan disini.." />
                                        <FormErrorMessage>{form.errors.keterangan}</FormErrorMessage>
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

export default InventoryMasterManageCreateItem;
