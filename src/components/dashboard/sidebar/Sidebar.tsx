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

/**
 * @fileoverview The sidebar menu.
 * @author Yehezkiel Dio <contact@yehezkieldio.xyz>
 */

import {
    Drawer,
    DrawerContent,
    CloseButton,
    Link,
    Text,
    Box,
    Flex,
    Icon,
    BoxProps,
    Divider,
    FlexProps,
    useDisclosure,
    IconButton,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    LinkOverlay,
    HStack,
    Button,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { ReactNode } from "react";
import { FiBook, FiFolder, FiHome, FiMenu, FiPieChart } from "react-icons/fi";

interface NavigationItemProps extends FlexProps {
    icon: IconType;
    link: string;
    children: string | number;
}

const NavigationItem = ({ icon, link, children, ...rest }: NavigationItemProps) => {
    return (
        <Link href={link} style={{ textDecoration: "none" }} _focus={{ boxShadow: "none" }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                mt={4}
                mb={4}
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: "gray.100",
                    color: "black",
                }}
                fontSize={{ lg: `14px` }}
                {...rest}
            >
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: "black",
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

interface SidebarProps extends BoxProps {
    onClose: () => void;
}

const Switch = (str: string | number) =>
    ({
        finance: "finance",
        inventory: "inventory",
        archive: "archive",
    }[str] || "");

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
    return (
        <Box
            transition={`3s ease`}
            bg={`gray.100`}
            borderRightWidth="1px"
            borderRightColor={`gray.200`}
            w={{ base: "full", md: 60 }}
            pos={`fixed`}
            h={`full`}
            {...rest}
        >
            <Flex h={`20`} alignItems={`center`} mx={`8`} justifyContent={`space-between`}>
                <Text fontSize={`2xl`} fontWeight={`bold`}>
                    administrare
                </Text>
                <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
            </Flex>
            <NavigationItem link={`/`} icon={FiHome}>
                Home
            </NavigationItem>
            <Divider mt={4} mb={4} bg={`gray.200`} />

            {Switch("inventory") && (
                <>
                    <Flex h={`10`} alignItems={`center`} mx={`4`} justifyContent={`space-between`}>
                        <Text fontSize={`small`} fontWeight={`bold`}>
                            inventory
                        </Text>
                    </Flex>
                    <NavigationItem link={`/inventory`} icon={FiPieChart}>
                        Inventory
                    </NavigationItem>
                    <NavigationItem link={`/inventory/actions`} icon={FiPieChart}>
                        Inventory Actions
                    </NavigationItem>
                    <Divider mt={4} mb={4} bg={`gray.200`} />
                    <Flex h={`10`} alignItems={`center`} mx={`4`} justifyContent={`space-between`}>
                        <Text fontSize={`small`} fontWeight={`bold`}>
                            inventory demand
                        </Text>
                    </Flex>
                    <NavigationItem link={`/inventory/demand`} icon={FiPieChart}>
                        Demand
                    </NavigationItem>
                    <NavigationItem link={`/inventory/demand/actions`} icon={FiPieChart}>
                        Demand Actions
                    </NavigationItem>
                </>
            )}
        </Box>
    );
};

interface MobileNavigationProps extends FlexProps {
    onOpen: () => void;
    type: string;
}

const MobileNavigation = ({ onOpen, ...rest }: MobileNavigationProps) => {
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            bg={`white`}
            alignItems={`center`}
            justifyContent={{ base: "space-between", md: "flex-end" }}
            {...rest}
        >
            <IconButton
                display={{ base: "flex", md: "none" }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />
            {/* {Switch("inventory") && (
                <>
                    <HStack visibility={{ lg: `visible`, sm: `hidden` }}></HStack>
                </>
            )} */}
        </Flex>
    );
};

export default function Sidebar({ type, children }: { type: string; children: ReactNode }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box minH={`100vh`}>
            <SidebarContent onClose={() => onClose} display={{ base: "none", md: "block" }} />
            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full"
            >
                <DrawerContent>
                    <SidebarContent onClose={onClose} />
                </DrawerContent>
            </Drawer>
            <MobileNavigation type={type} onOpen={onOpen} />
            <Box ml={{ base: 0, md: 60 }} p={4} zIndex={`-1`}>
                {children}
            </Box>
        </Box>
    );
}