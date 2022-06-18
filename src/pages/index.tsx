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
import Head from "next/head";
import { Button, Flex, Heading, Image, Stack, Text, LinkOverlay } from "@chakra-ui/react";
import axios from "axios";
import { useQuery } from "react-query";

import Footer from "@/components/Footer";

const Home: NextPage = () => {
    const userQuery = useQuery("userQuery", () => axios.get(`${process.env.BASE_DOMAIN}__api/user/me`, { withCredentials: true }).then((res) => res.data), {
        refetchOnMount: false,
        retry: false,
        retryDelay: 10000,
    });

    return (
        <>
            <Head>
                <title>administrare - web platform for internal data management</title>
            </Head>
            <Stack minHeight="100vh" direction={{ base: "column", md: "row" }}>
                <Flex padding={8} flex={1} align="center" justify="center">
                    <Stack spacing={6} width="full" maxWidth="lg">
                        <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }} fontWeight="bold">
                            <Text as="span" position="relative">
                                administrare
                            </Text>
                        </Heading>
                        <Text fontSize={{ base: "md", lg: "lg" }} color={"gray.500"}>
                            Aplikasi berbasis website yang bertujuan untuk mempermudah pengelolaan data internal sebuah organisasi.
                        </Text>
                        <>
                            <Stack direction={{ base: "column", md: "row" }} spacing={4}>
                                {userQuery.isLoading ? (
                                    <Text>Loading user data...</Text>
                                ) : (
                                    <>
                                        {userQuery.isError ? (
                                            <Button
                                                rounded="md"
                                                bg={"blue.400"}
                                                color={"white"}
                                                _hover={{
                                                    bg: "blue.500",
                                                }}
                                            >
                                                <LinkOverlay href="/login">Login</LinkOverlay>
                                            </Button>
                                        ) : (
                                            <>
                                                <Button rounded={"md"}>
                                                    <LinkOverlay href="/inventory">Inventory</LinkOverlay>
                                                </Button>
                                                <Button
                                                    rounded="md"
                                                    bg={"blue.400"}
                                                    color={"white"}
                                                    _hover={{
                                                        bg: "blue.500",
                                                    }}
                                                >
                                                    <LinkOverlay href="/__api/auth/user/logout">Logout</LinkOverlay>
                                                </Button>
                                            </>
                                        )}
                                    </>
                                )}
                            </Stack>
                        </>
                    </Stack>
                </Flex>
                <Flex flex={1}>
                    <Image
                        alt={"Login Image"}
                        objectFit={"cover"}
                        src={
                            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8aW52ZW50b3J5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                        }
                    />
                </Flex>
            </Stack>
            <Footer />
        </>
    );
};

export default Home;
