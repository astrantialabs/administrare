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
    Box,
    HStack,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
    useColorModeValue,
    VStack,
} from "@chakra-ui/react";
import { Logger } from "@nestjs/common";
import Router from "next/router";
import React from "react";
import { FiChevronDown } from "react-icons/fi";
import { useQuery } from "react-query";

export function DashboardMenu() {
    const { isLoading, error, data }: { isLoading: boolean; error: any; data: any } = useQuery("repoData", () =>
        fetch("http://localhost:3000/api/user/username/mirae").then((res) => res.json())
    );

    if (isLoading) return <Text>Loading...</Text>;

    return (
        <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: "none" }}>
                <HStack>
                    <VStack display={{ base: "none", md: "flex" }} alignItems="flex-start" spacing="1px" ml="2">
                        <Text fontSize="sm">{data.username}</Text>
                        <Text fontSize="xs" color="gray.600">
                            {data.permissionLevel}
                        </Text>
                    </VStack>
                    <Box display={{ base: "none", md: "flex" }}>
                        <FiChevronDown />
                    </Box>
                </HStack>
            </MenuButton>
            <MenuList
                bg={useColorModeValue("white", "gray.900")}
                borderColor={useColorModeValue("gray.200", "gray.700")}
            >
                <MenuItem>Profile</MenuItem>
                <MenuDivider />
                <MenuItem onClick={Router.push("/__api/auth/user/logout") as any}>Sign out</MenuItem>
            </MenuList>
        </Menu>
    );
}
