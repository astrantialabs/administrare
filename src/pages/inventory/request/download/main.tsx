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
import { useRouter } from "next/router";
import { Flex, Box, Heading, Text, Stack } from "@chakra-ui/react";
import { useQuery, UseQueryResult } from "react-query";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from "@chakra-ui/react";
import { DownloadOptionData } from "@/shared/typings/interfaces/inventory.interface";

import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { BASE_DOMAIN } from "@/shared/typings/constants";

const InventoryRequestDownloadMain: NextPage = () => {
    const router = useRouter();
    const downloadRequestQuery: UseQueryResult<any[], unknown> = useQuery("downloadRequestQuery", () =>
        axios.get(`${BASE_DOMAIN}__api/data/inventory/request/download/option`, { withCredentials: true }).then((res) => res.data)
    );

    if (downloadRequestQuery.isLoading) {
        console.log("loading");
    } else {
        console.log(downloadRequestQuery.data);
    }

    return (
        <Sidebar type="inventory">
            <Heading>Inventory Request</Heading>
            <Flex flexDirection={[`column`, `row`, `row`]}>
                <Stack spacing={8} marginY={8} marginX={8}>
                    {downloadRequestQuery.isLoading ? (
                        <Text>Loading</Text>
                    ) : (
                        downloadRequestQuery.data.map((item: DownloadOptionData) => (
                            <Accordion allowMultiple>
                                <AccordionItem borderWidth="1px" borderColor={`white`} cursor="pointer">
                                    <AccordionButton bg={`gray.100`} w="250px">
                                        <Box flex="1" textAlign="left">
                                            {item.name}
                                            <AccordionIcon />
                                        </Box>
                                    </AccordionButton>
                                    <AccordionPanel>
                                        <Flex flexDirection="column">
                                            {item.date.map((date) => (
                                                <>
                                                    <Stack spacing={2} marginY={2} marginX={2}>
                                                        <Box
                                                            bg={`gray.100`}
                                                            p={4}
                                                            onClick={() => (
                                                                router.push(`/__api/data/inventory/request/download/user/${item.id}/date/${date.id}`),
                                                                downloadRequestQuery.refetch()
                                                            )}
                                                        >
                                                            <Text>
                                                                {date.date == "Terbaru" ? date.date : `Laporan ${item.name} Permintaan Barang ${date.date}`}
                                                            </Text>
                                                        </Box>
                                                    </Stack>
                                                </>
                                            ))}
                                        </Flex>
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                        ))
                    )}
                </Stack>
            </Flex>
        </Sidebar>
    );
};

export default InventoryRequestDownloadMain;
