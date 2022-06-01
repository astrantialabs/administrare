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
import {
    FormikCreateBarangModel,
    FormikCreateDemandBarang,
} from "@/server/models/inventories/master/dto/item.schema";
import { fetch } from "@/shared/utils/fetch";
import { buildServerSideProps } from "@/client/ssr/buildServerSideProps";

type PageProps = {
    categories: any[];
};

const DemandCreateBarang: NextPage<PageProps> = ({ categories }) => {
    const toast = useToast();

    return (
        <Container maxW={`container.xl`} marginTop={`24px`} marginBottom={`24px`}>
            <Heading as={`h1`} size={`xl`} paddingBottom={`24px`} color={`blackAlpha.800`}>
                Bikin sebuah barang baru.
            </Heading>
            <Formik
                initialValues={new FormikCreateDemandBarang()}
                validate={FormikCreateDemandBarang.createValidator()}
                onSubmit={(values, action) => {
                    const payload = {
                        kategori_id: values.kategori_id,
                        username: values.username,
                        barang: values.barang,
                        satuan: values.satuan,
                    };

                    alert(payload);

                    action.setSubmitting(true);

                    // setTimeout(() => {
                    //     axios
                    //         .post("/api/data/inventory/create/barang", payload)
                    //         .then(() => {
                    //             toast({
                    //                 position: "top-right",
                    //                 title: "Item created.",
                    //                 description: `Barang bernama ${values.barang}  berhasil dibuat.`,
                    //                 status: "success",
                    //                 duration: 9000,
                    //                 isClosable: true,
                    //             });
                    //             action.setSubmitting(false);
                    //         })
                    //         .then(() => {
                    //             action.resetForm();
                    //         });
                    // }, 800);
                }}
            >
                {(props) => (
                    <Form>
                        <Field name="username">
                            {({
                                field,
                                form,
                            }: {
                                field: FieldInputProps<string>;
                                form: FormikProps<{ username: string }>;
                            }): JSX.Element => (
                                <FormControl isInvalid={form.errors.username && form.touched.username} mt={`24px`}>
                                    <FormLabel htmlFor="nama" fontWeight={`medium`} color={`blackAlpha.700`}>
                                        Username
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        id="username"
                                        placeholder="Nama satuan barang disini.."
                                        disabled={props.isSubmitting}
                                    />
                                    <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name="kategori_id">
                            {({
                                field,
                                form,
                            }: {
                                field: FieldInputProps<string>;
                                form: FormikProps<{ kategori_id: string }>;
                            }): JSX.Element => (
                                <FormControl isInvalid={form.errors.kategori_id && form.touched.kategori_id}>
                                    <FormLabel htmlFor="kategori" fontWeight={`medium`} color={`blackAlpha.700`}>
                                        Kategori
                                    </FormLabel>
                                    <Select {...field} id="kategori_id" disabled={props.isSubmitting}>
                                        <option value="">Pilih kategori</option>
                                        {categories.map((category) => (
                                            <option key={category.kategori} value={category.id}>
                                                {category.kategori}
                                            </option>
                                        ))}
                                    </Select>
                                    <FormErrorMessage>{form.errors.kategori_id}</FormErrorMessage>
                                </FormControl>
                            )}
                        </Field>
                        <Field name="barang">
                            {({
                                field,
                                form,
                            }: {
                                field: FieldInputProps<string>;
                                form: FormikProps<{ barang: string }>;
                            }): JSX.Element => (
                                <FormControl isInvalid={form.errors.barang && form.touched.barang} mt={`24px`}>
                                    <FormLabel htmlFor="nama" fontWeight={`medium`} color={`blackAlpha.700`}>
                                        Barang Barang
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        id="nama"
                                        placeholder="Nama barang barang disini.."
                                        disabled={props.isSubmitting}
                                    />
                                    <FormErrorMessage>{form.errors.barang}</FormErrorMessage>
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

                        <Button
                            mt={8}
                            colorScheme="teal"
                            isLoading={props.isSubmitting}
                            type="submit"
                            disabled={props.isSubmitting}
                        >
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};

export const getServerSideProps = buildServerSideProps<PageProps>(async () => {
    const categories: any = await fetch("/api/data/inventory/categories");

    return { categories };
});

export default DemandCreateBarang;
