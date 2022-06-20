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

import { BASE_DOMAIN } from "@/shared/typings/constants";
import {
    Box,
    HStack,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Button,
    Text,
    useColorModeValue,
    VStack,
    LinkOverlay,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { FiChevronDown } from "react-icons/fi";
import { useQuery } from "react-query";

export function DashboardMenu() {
    const userQuery = useQuery("userQuery", () => axios.get(`${BASE_DOMAIN}__api/user/me`, { withCredentials: true }).then((res) => res.data), {
        refetchOnMount: false,
        retry: false,
        retryDelay: 10000,
    });

    return (
        <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: "none" }}>
                <HStack>
                    <VStack display={{ base: "none", md: "flex" }} alignItems="flex-start" spacing="1px" ml="2">
                        {userQuery.isLoading ? (
                            <>
                                <Text fontSize="xs">Loading user data..</Text>
                            </>
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
                                        <Text fontSize="sm">{userQuery.data.username}</Text>
                                        <Text fontSize="xs" color="gray.600">
                                            {userQuery.data.permissionLevel}
                                        </Text>
                                    </>
                                )}
                            </>
                        )}
                    </VStack>
                    <Box display={{ base: "none", md: "flex" }}>
                        <FiChevronDown />
                    </Box>
                </HStack>
            </MenuButton>
            <MenuList bg={useColorModeValue("white", "gray.900")} borderColor={useColorModeValue("gray.200", "gray.700")}>
                <MenuItem>
                    <LinkOverlay href="/__api/auth/user/logout">Logout</LinkOverlay>
                </MenuItem>
            </MenuList>
        </Menu>
    );
}
