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
    FormErrorMessage,
    Button,
    useToast,
} from "@chakra-ui/react";
import { Formik, Form, Field, FieldInputProps, FormikProps } from "formik";
import { NextPage } from "next";
import axios from "axios";

import { FormikCreateKategoriModel } from "@/server/models/inventories/dto/category/create-category.schema";

type PageProps = {};

const ActionsCreateKategori: NextPage<PageProps> = () => {
    const toast = useToast();

    return (
        <Container maxW={`container.xl`} marginTop={`24px`} marginBottom={`24px`}>
            <Heading as={`h1`} size={`xl`} paddingBottom={`24px`} color={`blackAlpha.800`}>
                Bikin sebuah kategori baru.
            </Heading>
            <Formik
                initialValues={new FormikCreateKategoriModel()}
                validate={FormikCreateKategoriModel.createValidator()}
                onSubmit={(values, action) => {
                    const payload = {
                        kategori: values.kategori,
                    };

                    action.setSubmitting(true);

                    setTimeout(() => {
                        axios.post("/api/data/inventory/create/kategori", payload).then(() => {
                            toast({
                                position: "top-right",
                                title: "Category created.",
                                description: `Kategori bernama ${values.kategori.toUpperCase()}  berhasil dibuat.`,
                                status: "success",
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
                            }): JSX.Element => (
                                <FormControl isInvalid={form.errors.kategori && form.touched.kategori}>
                                    <FormLabel htmlFor="kategori" fontWeight={`medium`} color={`blackAlpha.700`}>
                                        Kategori
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        maxWidth={{ xl: `1200px` }}
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
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};

export default ActionsCreateKategori;
