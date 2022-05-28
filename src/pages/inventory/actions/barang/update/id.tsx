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
} from "@chakra-ui/react";
import { Formik, Form, Field, FieldInputProps, FormikProps } from "formik";
import { NextPage } from "next";
import axios from "axios";
import { FormikCreateBarangModel } from "@/server/models/inventories/dto/item/create-item.schema";
import { fetch } from "@/shared/utils/fetch";
import { buildServerSideProps } from "@/client/ssr/buildServerSideProps";

type PageProps = {
    payload: any[];
    kategoriId: string;
    barangId: string;
};

type PageQuery = {
    kategori_id: string;
    barang_id: string;
};

const ActionsUpdateBarang: NextPage<PageProps> = ({ payload, kategoriId, barangId }) => {
    const toast = useToast();

    return (
        <Container maxW={`container.xl`} marginTop={`24px`} marginBottom={`24px`}>
            <Heading as={`h1`} size={`xl`} paddingBottom={`24px`} color={`blackAlpha.800`}>
                Update sebuah barang baru.
            </Heading>
            <Formik
                initialValues={new FormikCreateBarangModel(true, payload)}
                validate={FormikCreateBarangModel.createValidator()}
                onSubmit={(values, action) => {
                    const payload = {
                        id: barangId,
                        nama: values.nama,
                        satuan: values.satuan,
                        saldo_jumlah_satuan: values.saldo_jumlah_satuan,
                        saldo_harga_satuan: values.saldo_harga_satuan,
                        saldo_akhir_jumlah_satuan: values.saldo_akhir_jumlah_satuan,
                        saldo_akhir_harga_satuan: values.saldo_akhir_harga_satuan,
                        mutasi_barang_masuk_jumlah_satuan: values.mutasi_barang_masuk_jumlah_satuan,
                        mutasi_barang_masuk_harga_satuan: values.mutasi_barang_masuk_harga_satuan,
                        mutasi_barang_keluar_jumlah_satuan: values.mutasi_barang_keluar_jumlah_satuan,
                        mutasi_barang_keluar_harga_satuan: values.mutasi_barang_keluar_harga_satuan,
                    };

                    alert(JSON.stringify(payload, null, 2));

                    action.setSubmitting(true);

                    setTimeout(() => {
                        axios
                            .put(`/api/data/inventory/update/${parseInt(kategoriId)}/${parseInt(barangId)}`, payload)
                            .then(() => {
                                toast({
                                    position: "top-right",
                                    title: "Item updated.",
                                    description: `Barang bernama ${values.nama}  berhasil diupdate.`,
                                    status: "success",
                                    duration: 9000,
                                    isClosable: true,
                                });
                                action.setSubmitting(false);
                            })
                            .then(() => {
                                action.resetForm();
                            });
                    }, 800);
                }}
            >
                {(props) => (
                    <Form>
                        <Field name="nama">
                            {({
                                field,
                                form,
                            }: {
                                field: FieldInputProps<string>;
                                form: FormikProps<{ nama: string }>;
                            }): JSX.Element => (
                                <FormControl isInvalid={form.errors.nama && form.touched.nama} mt={`24px`}>
                                    <FormLabel htmlFor="nama" fontWeight={`medium`} color={`blackAlpha.700`}>
                                        Uraian Barang
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        id="nama"
                                        placeholder="Nama barang disini.."
                                        disabled={props.isSubmitting}
                                    />
                                    <FormErrorMessage>{form.errors.nama}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name="satuan">
                            {({
                                field,
                                form,
                            }: {
                                field: FieldInputProps<string>;
                                form: FormikProps<{ satuan: string }>;
                            }): JSX.Element => (
                                <FormControl isInvalid={form.errors.satuan && form.touched.satuan} mt={`24px`}>
                                    <FormLabel htmlFor="nama" fontWeight={`medium`} color={`blackAlpha.700`}>
                                        Satuan Barang
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        id="nama"
                                        placeholder="Nama satuan barang disini.."
                                        disabled={props.isSubmitting}
                                    />
                                    <FormErrorMessage>{form.errors.satuan}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>

                        <Text mt={`24px`} mb={`24px`}>
                            Saldo
                        </Text>
                        <Field name="saldo_jumlah_satuan">
                            {({
                                field,
                                form,
                            }: {
                                field: FieldInputProps<string>;
                                form: FormikProps<{ saldo_jumlah_satuan: string }>;
                            }): JSX.Element => (
                                <FormControl
                                    isInvalid={form.errors.saldo_jumlah_satuan && form.touched.saldo_jumlah_satuan}
                                    mt={`24px`}
                                >
                                    <FormLabel htmlFor="nama" fontWeight={`medium`} color={`blackAlpha.700`}>
                                        Saldo: Jumlah Satuan
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        id="saldo_jumlah_satuan"
                                        placeholder="Saldo jumlah satuan disini.."
                                        disabled={props.isSubmitting}
                                    />
                                    <FormErrorMessage>{form.errors.saldo_jumlah_satuan}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name="saldo_harga_satuan">
                            {({
                                field,
                                form,
                            }: {
                                field: FieldInputProps<string>;
                                form: FormikProps<{ saldo_harga_satuan: string }>;
                            }): JSX.Element => (
                                <FormControl
                                    isInvalid={form.errors.saldo_harga_satuan && form.touched.saldo_harga_satuan}
                                    mt={`24px`}
                                >
                                    <FormLabel htmlFor="nama" fontWeight={`medium`} color={`blackAlpha.700`}>
                                        Saldo: Harga Satuan
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        id="saldo_harga_satuan"
                                        placeholder="Saldo harga satuan disini.."
                                        disabled={props.isSubmitting}
                                    />
                                    <FormErrorMessage>{form.errors.saldo_harga_satuan}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>

                        <Text mt={`24px`} mb={`24px`}>
                            Saldo Akhir
                        </Text>
                        <Field name="saldo_akhir_jumlah_satuan">
                            {({
                                field,
                                form,
                            }: {
                                field: FieldInputProps<string>;
                                form: FormikProps<{ saldo_akhir_jumlah_satuan: string }>;
                            }): JSX.Element => (
                                <FormControl
                                    isInvalid={
                                        form.errors.saldo_akhir_jumlah_satuan && form.touched.saldo_akhir_jumlah_satuan
                                    }
                                    mt={`24px`}
                                >
                                    <FormLabel htmlFor="nama" fontWeight={`medium`} color={`blackAlpha.700`}>
                                        Saldo Akhir: Jumlah Satuan
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        id="saldo_akhir_jumlah_satuan"
                                        placeholder="Saldo akhir jumlah satuan disini.."
                                        disabled={props.isSubmitting}
                                    />
                                    <FormErrorMessage>{form.errors.saldo_akhir_jumlah_satuan}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name="saldo_akhir_harga_satuan">
                            {({
                                field,
                                form,
                            }: {
                                field: FieldInputProps<string>;
                                form: FormikProps<{ saldo_akhir_harga_satuan: string }>;
                            }): JSX.Element => (
                                <FormControl
                                    isInvalid={
                                        form.errors.saldo_akhir_harga_satuan && form.touched.saldo_akhir_harga_satuan
                                    }
                                    mt={`24px`}
                                >
                                    <FormLabel htmlFor="nama" fontWeight={`medium`} color={`blackAlpha.700`}>
                                        Saldo Akhir: Harga Satuan
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        id="saldo_akhir_harga_satuan"
                                        placeholder="Saldo akhir harga satuan disini.."
                                        disabled={props.isSubmitting}
                                    />
                                    <FormErrorMessage>{form.errors.saldo_akhir_harga_satuan}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>

                        <Text mt={`24px`} mb={`24px`}>
                            Mutasi Barang Masuk
                        </Text>
                        <Field name="mutasi_barang_masuk_jumlah_satuan">
                            {({
                                field,
                                form,
                            }: {
                                field: FieldInputProps<string>;
                                form: FormikProps<{ mutasi_barang_masuk_jumlah_satuan: string }>;
                            }): JSX.Element => (
                                <FormControl
                                    isInvalid={
                                        form.errors.mutasi_barang_masuk_jumlah_satuan &&
                                        form.touched.mutasi_barang_masuk_jumlah_satuan
                                    }
                                    mt={`24px`}
                                >
                                    <FormLabel htmlFor="nama" fontWeight={`medium`} color={`blackAlpha.700`}>
                                        Mutasi Barang Masuk: Jumlah Satuan
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        id="mutasi_barang_masuk_jumlah_satuan"
                                        placeholder="Mutasi barang masuk jumlah satuan disini.."
                                        disabled={props.isSubmitting}
                                    />
                                    <FormErrorMessage>{form.errors.mutasi_barang_masuk_jumlah_satuan}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name="mutasi_barang_masuk_harga_satuan">
                            {({
                                field,
                                form,
                            }: {
                                field: FieldInputProps<string>;
                                form: FormikProps<{ mutasi_barang_masuk_harga_satuan: string }>;
                            }): JSX.Element => (
                                <FormControl
                                    isInvalid={
                                        form.errors.mutasi_barang_masuk_harga_satuan &&
                                        form.touched.mutasi_barang_masuk_harga_satuan
                                    }
                                    mt={`24px`}
                                >
                                    <FormLabel htmlFor="nama" fontWeight={`medium`} color={`blackAlpha.700`}>
                                        Saldo: Harga Satuan
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        id="mutasi_barang_masuk_harga_satuan"
                                        placeholder="Mutasi barang masuk harga satuan disini.."
                                        disabled={props.isSubmitting}
                                    />
                                    <FormErrorMessage>{form.errors.mutasi_barang_masuk_harga_satuan}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>

                        <Text mt={`24px`} mb={`24px`}>
                            Mutasi Barang Keluar
                        </Text>
                        <Field name="mutasi_barang_keluar_jumlah_satuan">
                            {({
                                field,
                                form,
                            }: {
                                field: FieldInputProps<string>;
                                form: FormikProps<{ mutasi_barang_keluar_jumlah_satuan: string }>;
                            }): JSX.Element => (
                                <FormControl
                                    isInvalid={
                                        form.errors.mutasi_barang_keluar_jumlah_satuan &&
                                        form.touched.mutasi_barang_keluar_jumlah_satuan
                                    }
                                    mt={`24px`}
                                >
                                    <FormLabel htmlFor="nama" fontWeight={`medium`} color={`blackAlpha.700`}>
                                        Mutasi Barang Keluar: Jumlah Satuan
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        id="mutasi_barang_keluar_jumlah_satuan"
                                        placeholder="Saldo jumlah satuan disini.."
                                        disabled={props.isSubmitting}
                                    />
                                    <FormErrorMessage>
                                        {form.errors.mutasi_barang_keluar_jumlah_satuan}
                                    </FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name="mutasi_barang_keluar_harga_satuan">
                            {({
                                field,
                                form,
                            }: {
                                field: FieldInputProps<string>;
                                form: FormikProps<{ mutasi_barang_keluar_harga_satuan: string }>;
                            }): JSX.Element => (
                                <FormControl
                                    isInvalid={
                                        form.errors.mutasi_barang_keluar_harga_satuan &&
                                        form.touched.mutasi_barang_keluar_harga_satuan
                                    }
                                    mt={`24px`}
                                >
                                    <FormLabel htmlFor="nama" fontWeight={`medium`} color={`blackAlpha.700`}>
                                        Mutasi Barang Keluar: Harga Satuan
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        id="mutasi_barang_keluar_harga_satuan"
                                        placeholder="Mutasi barang keluar harga satuan disini.."
                                        disabled={props.isSubmitting}
                                    />
                                    <FormErrorMessage>{form.errors.mutasi_barang_keluar_harga_satuan}</FormErrorMessage>
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
                            Update
                        </Button>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};

export const getServerSideProps = buildServerSideProps<PageProps, PageQuery>(async (ctx) => {
    const kategory_id = ctx.query.kategori_id;
    const barang_id = ctx.query.barang_id;

    const payload = await fetch(`/api/data/inventory/actions/update/${parseInt(kategory_id)}/${parseInt(barang_id)}`);

    return { payload: payload, kategoriId: kategory_id, barangId: barang_id };
});

export default ActionsUpdateBarang;