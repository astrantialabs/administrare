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
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Checkbox,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
    FormErrorMessage,
    Select,
    Container,
} from "@chakra-ui/react";
import { Field, FieldInputProps, Form, Formik, FormikProps } from "formik";
import { LoginFormModel } from "@/server/models/users/validators/login-form.model";
import Router from "next/router";
import axios from "axios";

type PageProps = {};

const AuthenticationLogin: NextPage<PageProps> = () => {
    return (
        <Flex minH={"100vh"} align={"center"} justify={"center"} bg={`whiteAlpha.700`}>
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                <Stack align={"center"} textAlign={`center`}>
                    <Text fontSize={"sm"} color={"teal.600"} lineHeight={`23.2px`}>
                        administrare
                    </Text>
                    <Heading fontSize={"4xl"}>Masuk ke akun anda</Heading>
                    <Text fontSize={"md"} color={"gray.600"} lineHeight={`23.2px`}>
                        Selamat datang, silahkan untuk masuk ke akun anda untuk melanjutkan.
                    </Text>
                </Stack>
                <Box rounded={"lg"} bg={`whiteAlpha.700`} boxShadow={"lg"} p={8}>
                    <Stack spacing={4}>
                        <Formik
                            initialValues={new LoginFormModel()}
                            validate={LoginFormModel.createValidator()}
                            onSubmit={(values, action) => {
                                action.setSubmitting(true);

                                const payload = {
                                    username: values.username,
                                    password: values.password,
                                };

                                setTimeout(() => {
                                    axios
                                        .post("/__api/auth/user/login", payload, { withCredentials: true })
                                        .then((response) => {
                                            action.setSubmitting(false);
                                            Router.push("/dashboard");
                                        })
                                        .catch((error) => {
                                            action.setSubmitting(false);
                                            action.setErrors({
                                                username: "Username atau password salah",
                                                password: "Username atau password salah",
                                            });
                                        });
                                }, 500);
                            }}
                        >
                            {(props) => (
                                <Form>
                                    <Stack spacing={8}>
                                        <Field name="username">
                                            {({ field, form }: { field: FieldInputProps<string>; form: FormikProps<{ username: string }> }): JSX.Element => (
                                                <FormControl isInvalid={form.errors.username && form.touched.username}>
                                                    <FormLabel htmlFor="username">Username</FormLabel>
                                                    <Input {...field} id="username" placeholder="Username" type={`text`} disabled={props.isSubmitting} />
                                                    <FormErrorMessage>{form.errors.username}</FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>

                                        <Field name="password">
                                            {({ field, form }: { field: FieldInputProps<string>; form: FormikProps<{ password: string }> }): JSX.Element => (
                                                <FormControl isInvalid={form.errors.password && form.touched.password}>
                                                    <FormLabel htmlFor="password">Password</FormLabel>
                                                    <Input {...field} id="password" placeholder="Password" type={`password`} disabled={props.isSubmitting} />
                                                    <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                                                </FormControl>
                                            )}
                                        </Field>

                                        <Button mt={8} colorScheme={`teal`} isLoading={props.isSubmitting} type="submit" disabled={props.isSubmitting}>
                                            Masuk
                                        </Button>
                                    </Stack>
                                </Form>
                            )}
                        </Formik>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
};

export default AuthenticationLogin;
